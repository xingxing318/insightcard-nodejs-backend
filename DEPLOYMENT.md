# Railway部署操作指南

## 🚀 快速部署步骤

### 1. 推送代码到GitHub
```bash
git push origin main
```

### 2. 在Railway创建项目
1. 访问: https://railway.app
2. 使用GitHub登录
3. 点击 "New Project" → "Deploy from GitHub repo"
4. 选择 `insightcard-nodejs-backend` 仓库

### 3. 配置环境变量
在Railway项目的Variables页面添加：
```
DEEPSEEK_API_KEY=sk-your_actual_api_key_here
```

### 4. 获取DeepSeek API密钥
1. 访问: https://platform.deepseek.com/
2. 注册并登录账号
3. 创建API密钥
4. 复制密钥到Railway环境变量

### 5. 验证部署
- 访问分配的域名: `https://your-app.railway.app`
- 测试健康检查: `https://your-app.railway.app/health`
- 测试摘要功能: 在网页界面输入文本或URL

## 🔧 故障排除

### 部署失败
- 检查Railway部署日志
- 确认package.json中的start脚本
- 验证Node.js版本 >= 18.0.0

### API无响应
- 确认DEEPSEEK_API_KEY环境变量已设置
- 检查API密钥是否有效
- 查看Railway应用日志

### 无法访问
- 确认Railway应用状态为"Running"
- 检查健康检查路径 `/health`
- 验证端口配置（Railway自动设置）

## 📝 配置文件说明

项目包含以下Railway配置：
- `railway.toml` - Railway部署配置
- `Procfile` - 进程启动配置
- `.env.example` - 环境变量模板

## 🎯 部署后测试

1. **健康检查**:
   ```bash
   curl https://your-app.railway.app/health
   ```

2. **摘要API测试**:
   ```bash
   curl -X POST https://your-app.railway.app/api/summary \
     -H "Content-Type: application/json" \
     -d '{"text":"测试内容"}'
   ```

## 🔗 相关链接

- Railway官网: https://railway.app
- DeepSeek平台: https://platform.deepseek.com/
- 项目GitHub: https://github.com/xingxing318/insightcard-nodejs-backend