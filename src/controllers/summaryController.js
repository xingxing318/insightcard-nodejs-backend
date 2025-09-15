const ContentParser = require('../services/contentParser');
const AISummaryService = require('../services/aiSummary');

const contentParser = new ContentParser();
const aiSummary = new AISummaryService();

class SummaryController {
  async createSummary(req, res) {
    try {
      const { url, text } = req.body;

      if (!url && !text) {
        return res.status(400).json({
          success: false,
          message: '请提供URL链接或文本内容'
        });
      }

      let contentData;

      if (url) {
        // 验证URL格式
        if (!contentParser.isValidUrl(url)) {
          return res.status(400).json({
            success: false,
            message: 'URL格式不正确'
          });
        }

        // 解析URL内容
        contentData = await contentParser.parseUrl(url);
      } else {
        // 直接使用提供的文本
        contentData = {
          title: '用户提供的文本',
          content: text,
          url: null,
          wordCount: text.length,
          estimatedReadTime: Math.ceil(text.length / 300)
        };
      }

      // 检查内容长度
      if (contentData.content.length < 50) {
        return res.status(400).json({
          success: false,
          message: '内容过短，无法生成有效摘要'
        });
      }

      // 生成AI摘要
      const summary = await aiSummary.generateSummary(contentData.content, contentData.title);

      // 组装响应数据
      const result = {
        success: true,
        data: {
          source: {
            title: contentData.title,
            url: contentData.url,
            wordCount: contentData.wordCount,
            estimatedReadTime: contentData.estimatedReadTime
          },
          summary: {
            keyPoints: summary.keyPoints,
            quotes: summary.quotes,
            tags: summary.tags,
            oneSentenceSummary: summary.oneSentenceSummary,
            credibilityScore: summary.credibilityScore
          },
          metadata: {
            generatedAt: new Date().toISOString(),
            timeSaved: Math.max(contentData.estimatedReadTime - 1, 0) // 假设摘要阅读需要1分钟
          }
        }
      };

      res.json(result);

    } catch (error) {
      console.error('摘要生成错误:', error);

      res.status(500).json({
        success: false,
        message: error.message || '摘要生成失败',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // 健康检查
  async healthCheck(req, res) {
    res.json({
      success: true,
      message: '速读酱 API 服务正常',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = new SummaryController();