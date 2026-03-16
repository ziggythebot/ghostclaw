import { chromium } from 'playwright';

async function fetchTweet(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  const page = await context.newPage();

  try {
    console.log(`\n=== Fetching: ${url} ===\n`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait a bit for dynamic content
    await page.waitForTimeout(3000);

    // Get page title
    const title = await page.title();
    console.log(`Title: ${title}\n`);

    // Try multiple selectors for tweets
    const tweetText = await page.evaluate(() => {
      // Try to get all text content from tweets
      const selectors = [
        '[data-testid="tweetText"]',
        'article[data-testid="tweet"]',
        '[role="article"]'
      ];

      let results = [];
      for (const selector of selectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          elements.forEach(el => {
            const text = el.textContent?.trim();
            if (text && text.length > 10) {
              results.push(text);
            }
          });
          if (results.length > 0) break;
        }
      }

      // If nothing found, get all visible text
      if (results.length === 0) {
        const body = document.body.innerText;
        return body.slice(0, 5000); // First 5000 chars
      }

      return results.join('\n\n---\n\n');
    });

    console.log('CONTENT:');
    console.log(tweetText);
    console.log('\n');

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
