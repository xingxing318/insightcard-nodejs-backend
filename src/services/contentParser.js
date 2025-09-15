const axios = require('axios');
const cheerio = require('cheerio');

class ContentParser {
  async parseUrl(url) {
    try {
      // 获取网站特定的请求配置
      const config = this.getRequestConfig(url);

      const response = await axios.get(url, config);

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

      // 获取网站特定的内容选择器
      const contentSelectors = this.getContentSelectors(url);

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

  // 获取网站特定的请求配置
  getRequestConfig(url) {
    const domain = new URL(url).hostname;

    // 基础配置
    const baseConfig = {
      timeout: 15000,
      maxRedirects: 5,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    };

    // 网站特定配置
    if (domain.includes('zhihu.com')) {
      baseConfig.headers = {
        ...baseConfig.headers,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.zhihu.com/',
        'Origin': 'https://www.zhihu.com',
        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"macOS"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1'
      };
    } else if (domain.includes('weixin.qq.com')) {
      baseConfig.headers = {
        ...baseConfig.headers,
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1 wechatdevtools/1.06.2307260 MicroMessenger/8.0.5 Language/zh_CN webview/',
        'Referer': 'https://mp.weixin.qq.com/'
      };
    } else if (domain.includes('36kr.com') || domain.includes('sspai.com') || domain.includes('jianshu.com')) {
      baseConfig.headers = {
        ...baseConfig.headers,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': `https://${domain}/`
      };
    } else {
      // 通用配置
      baseConfig.headers['User-Agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    }

    return baseConfig;
  }

  // 获取网站特定的内容选择器
  getContentSelectors(url) {
    const domain = new URL(url).hostname;

    // 知乎特定选择器
    if (domain.includes('zhihu.com')) {
      return [
        '.RichContent-inner',
        '.QuestionAnswer-content',
        '.Post-RichText',
        '.AnswerCard .RichContent',
        '.Question-mainColumn',
        'article',
        '.content'
      ];
    }

    // 微信公众号特定选择器
    if (domain.includes('weixin.qq.com')) {
      return [
        '#js_content',
        '.rich_media_content',
        '.msg-content',
        'article'
      ];
    }

    // 简书特定选择器
    if (domain.includes('jianshu.com')) {
      return [
        '.show-content',
        'article .content',
        '.post .content'
      ];
    }

    // 36氪特定选择器
    if (domain.includes('36kr.com')) {
      return [
        '.articleDetailContent',
        '.kr-rich-text',
        'article .content'
      ];
    }

    // 少数派特定选择器
    if (domain.includes('sspai.com')) {
      return [
        '.article-body',
        '.content',
        'article'
      ];
    }

    // 掘金特定选择器
    if (domain.includes('juejin.cn')) {
      return [
        '.markdown-body',
        'article .content'
      ];
    }

    // CSDN特定选择器
    if (domain.includes('csdn.net')) {
      return [
        '#content_views',
        '.blog-content-box',
        'article'
      ];
    }

    // 博客园特定选择器
    if (domain.includes('cnblogs.com')) {
      return [
        '#cnblogs_post_body',
        '.postBody',
        'article'
      ];
    }

    // 通用选择器
    return [
      'article',
      '.content',
      '.post-content',
      '.entry-content',
      '.article-content',
      '.article-body',
      '#content',
      'main',
      '.main-content',
      '.rich-content',
      '.text-content'
    ];
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