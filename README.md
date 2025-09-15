# 速读酱 (Sumly) - AI阅读摘要助理

> 用1/10的时间获取90%的核心价值

## 📋 项目简介

速读酱是一个多模态AI阅读与摘要助理，帮助用户在信息洪流中快速提取核心价值。支持URL链接和文本内容的智能摘要，为知识工作者、终身学习者和内容创作者提供高效的信息处理工具。

## ✨ 核心功能

- **URL内容解析**: 支持各类网页文章的智能解析
- **文本摘要**: 直接输入文本内容进行AI摘要
- **结构化输出**: 提供核心观点、金句摘录、关键词标签等
- **一键式体验**: 简洁的Web界面，操作流畅
- **模拟演示模式**: 无需API密钥即可体验基本功能

## 🚀 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装运行

1. **克隆项目**
   ```bash
   git clone https://github.com/xingxing318/insightcard-nodejs-backend.git
   cd insightcard-nodejs-backend
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env .env.local
   # 编辑 .env 文件，配置 Gemini API 密钥
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **启动项目**
   ```bash
   # 开发模式
   npm run dev

   # 生产模式
   npm start
   ```

5. **访问应用**
   - Web界面: http://localhost:3000
   - API文档: http://localhost:3000/health

## 🔧 API接口

### 健康检查
```bash
GET /health
```

### 生成摘要
```bash
POST /api/summary
Content-Type: application/json

# URL摘要
{
  "url": "https://example.com/article"
}

# 文本摘要
{
  "text": "要摘要的文本内容..."
}
```

### 响应格式
```json
{
  "success": true,
  "data": {
    "source": {
      "title": "文章标题",
      "url": "原文链接",
      "wordCount": 1500,
      "estimatedReadTime": 5
    },
    "summary": {
      "keyPoints": ["要点1", "要点2", "要点3"],
      "quotes": ["金句1", "金句2"],
      "tags": ["标签1", "标签2", "标签3"],
      "oneSentenceSummary": "一句话总结",
      "credibilityScore": 85
    },
    "metadata": {
      "generatedAt": "2024-09-15T10:30:00.000Z",
      "timeSaved": 4
    }
  }
}
```

## 📁 项目结构

```
insightcard-nodejs-backend/
├── src/
│   ├── controllers/         # 控制器层
│   │   └── summaryController.js
│   ├── services/           # 服务层
│   │   ├── contentParser.js    # 内容解析服务
│   │   └── aiSummary.js        # AI摘要服务
│   └── utils/              # 工具函数
├── public/                 # 静态文件
│   └── index.html         # Web界面
├── index.js               # 应用入口
├── package.json
├── .env                   # 环境变量
└── README.md
```

## 🔧 技术栈

- **后端**: Node.js + Express
- **AI服务**: Google Gemini 2.0 Flash
- **内容解析**: Cheerio + Axios
- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **工具**: nodemon, dotenv

## 🎯 使用场景

### 知识工作者
- 快速阅读行业报告和竞品分析
- 高效消化会议资料和技术文档
- 跟踪新领域知识和趋势

### 终身学习者
- 处理收藏的"稍后阅读"文章
- 快速构建学科知识框架
- 消化在线课程和知识付费内容

### 内容创作者
- 快速收集创作素材和背景资料
- 追踪热点事件和各方观点
- 提取"金句"和核心信息

## ⚙️ 配置说明

### Google Gemini API配置
1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey) 获取API密钥
2. 在 `.env` 文件中配置:
   ```
   GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 模拟模式
如果没有配置Gemini API密钥，系统会自动使用模拟数据进行演示，您可以：
- 体验完整的界面交互
- 查看摘要卡片的展示效果
- 测试API接口的基本功能

## 🔄 开发计划

- [x] **MVP版本** - 基础摘要功能
- [ ] **v1.1** - 支持更多内容类型(PDF、视频)
- [ ] **v1.2** - 浏览器插件开发
- [ ] **v1.3** - 用户系统和历史记录
- [ ] **v2.0** - 多模态支持(视频、音频)

## 📝 许可证

ISC License

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 📞 联系方式

- GitHub: [xingxing318](https://github.com/xingxing318)
- 项目地址: [insightcard-nodejs-backend](https://github.com/xingxing318/insightcard-nodejs-backend)

---

**速读酱** - 让阅读更高效，让知识更易得 🚀