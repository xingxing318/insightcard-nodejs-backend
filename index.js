const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const summaryController = require('./src/controllers/summaryController');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/health', summaryController.healthCheck);
app.post('/api/summary', summaryController.createSummary);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  });
});

app.listen(port, () => {
  console.log(`🚀 速读酱服务器已启动`);
  console.log(`📍 地址: http://localhost:${port}`);
  console.log(`🔗 API文档: http://localhost:${port}/health`);
});
