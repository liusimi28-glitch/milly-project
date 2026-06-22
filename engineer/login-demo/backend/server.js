const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// 中间件
app.use(cors());
app.use(express.json());

// 导入路由
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`后端服务已启动，监听 http://localhost:${port}`);
});