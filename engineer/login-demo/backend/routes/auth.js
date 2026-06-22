const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const router = express.Router();

const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    JWT_SECRET,
    FRONTEND_URL = 'http://localhost:5173',
    GITHUB_CALLBACK_URL = 'http://localhost:5000/api/auth/github/callback',
} = process.env;

const oauthStates = new Map();

function cleanupExpiredStates() {
    const now = Date.now();
    for (const [state, createdAt] of oauthStates.entries()) {
        if (now - createdAt > 10 * 60 * 1000) {
            oauthStates.delete(state);
        }
    }
}

router.get('/github', (req, res) => {
    cleanupExpiredStates();

    const state = crypto.randomBytes(16).toString('hex');
    oauthStates.set(state, Date.now());

    const params = new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        redirect_uri: GITHUB_CALLBACK_URL,
        scope: 'read:user user:email',
        state,
    });

    res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

router.get('/github/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code || !state || !oauthStates.has(state)) {
        return res.redirect(`${FRONTEND_URL}/login?error=invalid_state`);
    }

    oauthStates.delete(state);

    try {
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: GITHUB_CLIENT_ID,
                client_secret: GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: GITHUB_CALLBACK_URL,
            },
            {
                headers: { Accept: 'application/json' },
            }
        );

        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) {
            return res.redirect(`${FRONTEND_URL}/login?error=no_token`);
        }

        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        const githubUser = userResponse.data;
        const token = jwt.sign(
            {
                id: githubUser.id,
                login: githubUser.login,
                name: githubUser.name,
                avatar_url: githubUser.avatar_url,
            },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.redirect(`${FRONTEND_URL}/callback?token=${token}`);
    } catch (error) {
        console.error('GitHub OAuth 失败:', error.response?.data || error.message);
        res.redirect(`${FRONTEND_URL}/login?error=auth_failed`);
    }
});

router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: '未登录' });
    }

    try {
        const token = authHeader.slice(7);
        const user = jwt.verify(token, JWT_SECRET);
        res.json({ user });
    } catch {
        res.status(401).json({ error: 'token 无效或已过期' });
    }
});

// ---------- GitHub OAuth 登录 ----------

// 1. 前端点击“GitHub登录”时，返回一个授权 URL，前端重定向到该 URL
router.get('/github', (req, res) => {
    const redirectUri = 'http://localhost:5000/api/auth/github/callback';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
    res.json({ url: githubAuthUrl });
});

// 2. GitHub 重定向回调地址，携带 code
router.get('/github/callback', async (req, res) => {
    const { code } = req.query;
    if (!code) {
        return res.status(400).send('缺少 code 参数');
    }

    try {
        // 2.1 用 code 换取 access_token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
                redirect_uri: 'http://localhost:5000/api/auth/github/callback',
            },
            {
                headers: { Accept: 'application/json' },
            }
        );
        const accessToken = tokenResponse.data.access_token;
        if (!accessToken) {
            return res.status(401).send('获取 access_token 失败');
        }

        // 2.2 用 access_token 获取用户基本信息
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        });
        const userData = userResponse.data;

        // 2.3 获取用户的邮箱（可能为 null，需要调用 /user/emails 接口获取主邮箱）
        let email = userData.email;
        if (!email) {
            const emailsResponse = await axios.get('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: 'application/json',
                },
            });
            const primaryEmail = emailsResponse.data.find(e => e.primary && e.verified);
            email = primaryEmail ? primaryEmail.email : null;
        }

        if (!email) {
            return res.status(401).send('无法获取 GitHub 邮箱，请确保您的 GitHub 账号有公开邮箱或已验证');
        }

        // 2.4 检查用户是否已存在，不存在则创建（密码随机）
        const bcrypt = require('bcrypt');
        const { findUserByEmail, createUser } = require('../models/User');
        let user = findUserByEmail(email);
        if (!user) {
            const dummyPassword = await bcrypt.hash('github_' + Math.random().toString(36).substring(2), 10);
            const name = userData.name || userData.login || email.split('@')[0];
            user = createUser(email, dummyPassword, name);
            if (!user) {
                return res.status(500).send('创建用户失败');
            }
        }

        // 2.5 生成 JWT Token
        const jwt = require('jsonwebtoken');
        const jwtToken = jwt.sign(
            { userId: email, email: email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // 2.6 重定向到前端页面，并将 token 作为 URL 参数传递
        // 注意：这里的前端地址要改为你实际运行前端的地址（Live Server 默认是 127.0.0.1:5500）
        const frontendUrl = `http://127.0.0.1:5500/dashboard.html?token=${jwtToken}`;
        res.redirect(frontendUrl);

    } catch (error) {
        console.error('GitHub OAuth 错误:', error);
        res.status(500).send('服务器错误，请查看后端日志');
    }
});
module.exports = router;
