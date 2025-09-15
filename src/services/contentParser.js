const axios = require('axios');
const cheerio = require('cheerio');

class ContentParser {
  async parseUrl(url) {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);

      // 移除不需要的元素
      $('script, style, nav, header, footer, .ad, .advertisement, .sidebar').remove();

      // 尝试提取标题
      let title = $('title').text().trim();
      if (!title) {
        title = $('h1').first().text().trim();
      }

      // 尝试提取正文内容
      let content = '';

      // 常见的内容选择器
      const contentSelectors = [
        'article',
        '.content',
        '.post-content',
        '.entry-content',
        '.article-content',
        '#content',
        'main',
        '.main-content'
      ];

      for (const selector of contentSelectors) {
        const element = $(selector);
        if (element.length && element.text().trim().length > 100) {
          content = element.text().trim();
          break;
        }
      }

      // 如果没有找到合适的内容区域，提取所有p标签
      if (!content) {
        content = $('p').map((i, el) => $(el).text().trim()).get().join('\n');
      }

      // 清理内容
      content = content.replace(/\s+/g, ' ').trim();

      return {
        title,
        content,
        url,
        wordCount: content.length,
        estimatedReadTime: Math.ceil(content.length / 300) // 假设每分钟300字
      };

    } catch (error) {
      throw new Error(`解析URL失败: ${error.message}`);
    }
  }

  // 验证URL格式
  isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = ContentParser;