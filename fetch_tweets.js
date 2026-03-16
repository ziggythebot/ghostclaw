const { chromium } = require('playwright');

async function fetchTweet(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  try {
    console.log(`\n=== Fetching: ${url} ===\n`);
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

    // Wait for tweets to load
    await page.waitForSelector('article[data-testid="tweet"]', { timeout: 10000 });

    // Get all tweet text in the thread
    const tweets = await page.$$eval('article[data-testid="tweet"]', articles => {
      return articles.map(article => {
        const textEl = article.querySelector('[data-testid="tweetText"]');
        const authorEl = article.querySelector('[data-testid="User-Name"]');
        return {
          author: authorEl?.textContent || '',
          text: textEl?.textContent || ''
        };
      });
    });

    console.log(`Found ${tweets.length} tweets\n`);
    tweets.forEach((tweet, i) => {
      console.log(`--- Tweet ${i + 1} ---`);
      console.log(`Author: ${tweet.author}`);
      console.log(`Text: ${tweet.text}\n`);
    });

  } catch (error) {
    console.error(`Error fetching ${url}:`, error.message);
  } finally {
    await browser.close();
  }
}

async function main() {
  const urls = [
    'https://x.com/deronin_/status/2032796569808830921',
    'https://x.com/arscontexta/status/2023957499183829467'
  ];

  for (const url of urls) {
    await fetchTweet(url);
  }
}

main();
