# Claude Code 项目记录

## 🤖 AI助手信息
- **助手**: Claude Code (Sonnet 4)
- **开发日期**: 2025-09-15
- **会话状态**: MVP开发完成

## 📋 项目状态总结

### 当前运行状态
- ✅ 服务器运行在 http://localhost:3000
- ✅ 使用 `npm run dev` 启动开发模式
- ✅ Gemini API 已集成（模拟模式）

### 核心功能实现
1. **URL内容解析** - 支持网页文章智能解析
2. **AI摘要生成** - 使用Google Gemini 2.0 Flash
3. **Web界面** - 简洁美观的用户界面
4. **API服务** - RESTful API接口
5. **模拟模式** - 无需API密钥即可演示

### 技术架构
```
Backend: Node.js + Express
AI: Google Gemini 2.0 Flash API
Parser: Cheerio + Axios
Frontend: 原生 HTML/CSS/JS
Dev Tools: nodemon, dotenv
```

## 🔧 重要命令

### 启动项目
```bash
cd "/Users/mr.xing/Desktop/Coder Project/insightcard-nodejs-backend"
npm run dev
```

### 测试接口
```bash
# 健康检查
curl http://localhost:3000/health

# 摘要测试
curl -X POST http://localhost:3000/api/summary \
  -H "Content-Type: application/json" \
  -d '{"text":"测试内容"}'
```

## ⚙️ 配置信息

### 环境变量 (.env)
```
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

### 依赖包
- @google/generative-ai: Gemini API客户端
- express: Web框架
- cors: 跨域支持
- cheerio: HTML解析
- axios: HTTP客户端
- dotenv: 环境变量
- nodemon: 开发工具

## 📝 下次继续开发时

### 1. 环境检查
```bash
# 检查Node.js版本
node --version

# 检查项目依赖
npm list --depth=0

# 检查服务状态
curl http://localhost:3000/health
```

### 2. 开发建议
- 优先实现浏览器插件
- 添加用户系统和历史记录
- 支持更多内容格式(PDF、视频)
- 优化AI摘要质量

### 3. 部署准备
- 配置生产环境变量
- 选择云服务商(Vercel/Railway/Heroku)
- 设置域名和SSL证书

## 🔗 相关链接
- GitHub: https://github.com/xingxing318/insightcard-nodejs-backend
- Gemini API: https://makersuite.google.com/app/apikey
- 本地服务: http://localhost:3000

## 💭 开发思路记录
这个项目采用了最小化可行产品(MVP)的开发策略，优先实现核心功能，然后逐步扩展。使用Gemini API替代OpenAI是一个很好的选择，性能更好且成本更低。

---
*此文件帮助Claude Code在下次会话时快速了解项目状态和继续开发*