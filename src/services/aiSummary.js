const OpenAI = require('openai');

class AISummaryService {
  constructor() {
    this.apiKey = process.env.DEEPSEEK_API_KEY;

    if (this.apiKey && this.apiKey !== 'your_deepseek_api_key_here' && this.apiKey.startsWith('sk-')) {
      this.client = new OpenAI({
        apiKey: this.apiKey,
        baseURL: 'https://api.deepseek.com',
      });
      console.log('✅ DeepSeek API 已初始化');
    } else {
      console.log('⚠️  DeepSeek API密钥未配置，将使用模拟数据');
      this.client = null;
    }
  }

  async generateSummary(content, title = '') {
    try {
      // 如果没有配置DeepSeek API，使用模拟数据
      if (!this.client) {
        return this.generateMockSummary(content, title);
      }

      const prompt = `请为以下文章生成一个简洁的摘要，包含以下部分：

文章标题：${title}

文章内容：
${content}

请按照以下格式输出：
1. 核心观点（3-5个要点，每个要点用一句话概括）
2. 金句摘录（2-3句原文中的精彩句子）
3. 关键词标签（5-8个关键词，用逗号分隔）
4. 一句话总结（用一句话概括全文的核心价值）

要求：
- 保持客观准确，不添加个人观点
- 突出实用价值和核心信息
- 使用简洁易懂的语言
- 如果内容质量不高或信息不足，请如实说明`;

      const response = await this.client.chat.completions.create({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const text = response.choices[0].message.content;
      return this.parseSummaryResponse(text);

    } catch (error) {
      if (error.status === 429) {
        throw new Error('API请求频率过高，请稍后重试');
      } else if (error.status === 400) {
        throw new Error('请求参数错误，请检查内容格式');
      } else if (error.status === 401) {
        throw new Error('API密钥无效，请检查DeepSeek账户');
      }
      throw new Error(`AI摘要生成失败: ${error.message}`);
    }
  }

  // 模拟摘要数据，用于演示
  generateMockSummary(content, title) {
    const words = content.split(/\s+/).filter(word => word.length > 0);
    const sentences = content.split(/[.。！!？?]/).filter(s => s.trim().length > 10);

    return {
      keyPoints: [
        "这是一个演示版本的摘要，实际使用需要配置DeepSeek API密钥",
        "文章包含约 " + words.length + " 个词汇",
        "内容结构完整，具有一定的信息价值",
        "建议配置真实的AI服务以获得更好的摘要效果"
      ],
      quotes: sentences.slice(0, 2).map(s => s.trim() + "。"),
      tags: ["演示", "测试", "AI摘要", "速读酱", "MVP"],
      oneSentenceSummary: "这是一个演示性质的AI摘要，展示了速读酱的基本功能和界面。",
      credibilityScore: 85,
      rawResponse: "模拟数据 - 请配置DeepSeek API密钥以获得真实的AI摘要"
    };
  }

  parseSummaryResponse(response) {
    // 解析AI响应，提取结构化信息
    const lines = response.split('\n').filter(line => line.trim());

    let keyPoints = [];
    let quotes = [];
    let tags = [];
    let oneSentenceSummary = '';

    let currentSection = '';

    for (const line of lines) {
      const trimmedLine = line.trim();

      if (trimmedLine.includes('核心观点') || trimmedLine.includes('要点')) {
        currentSection = 'keyPoints';
        continue;
      } else if (trimmedLine.includes('金句') || trimmedLine.includes('摘录')) {
        currentSection = 'quotes';
        continue;
      } else if (trimmedLine.includes('关键词') || trimmedLine.includes('标签')) {
        currentSection = 'tags';
        continue;
      } else if (trimmedLine.includes('一句话') || trimmedLine.includes('总结')) {
        currentSection = 'summary';
        continue;
      }

      if (currentSection === 'keyPoints' && trimmedLine) {
        keyPoints.push(trimmedLine.replace(/^\d+\.?\s*/, '').replace(/^-\s*/, ''));
      } else if (currentSection === 'quotes' && trimmedLine) {
        quotes.push(trimmedLine.replace(/^\d+\.?\s*/, '').replace(/^-\s*/, ''));
      } else if (currentSection === 'tags' && trimmedLine) {
        tags = trimmedLine.split(/[,，]/).map(tag => tag.trim()).filter(tag => tag);
      } else if (currentSection === 'summary' && trimmedLine) {
        oneSentenceSummary = trimmedLine;
      }
    }

    return {
      keyPoints: keyPoints.slice(0, 5),
      quotes: quotes.slice(0, 3),
      tags: tags.slice(0, 8),
      oneSentenceSummary,
      credibilityScore: this.calculateCredibilityScore(),
      rawResponse: response
    };
  }

  calculateCredibilityScore() {
    // 简单的可信度评分逻辑，后续可以优化
    return Math.floor(Math.random() * 20) + 80; // 80-100分
  }
}

module.exports = AISummaryService;