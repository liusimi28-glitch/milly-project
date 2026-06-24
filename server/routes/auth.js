const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const router = express.Router();

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  JWT_SECRET,
  FRONTEND_URL = 'http://localhost:3000',
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
    console.error('GitHub OAuth failed:', error.response?.data || error.message);
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

module.exports = router;
