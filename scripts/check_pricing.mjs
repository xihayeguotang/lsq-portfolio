import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Take screenshot of the full page
await page.screenshot({ path: '/tmp/pricing_full.png', fullPage: true });

// Get the bounding box of "2年卡" text and its surrounding
const info = await page.evaluate(() => {
  // Find "2年卡" text nodes
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const results = [];
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.textContent?.includes('2年卡')) {
      const range = document.createRange();
      range.selectNodeContents(node);
      const rect = range.getBoundingClientRect();
      results.push({ text: node.textContent, x: rect.x, y: rect.y, w: rect.width, h: rect.height });
    }
  }
  return results;
});

console.log('2年卡 bounding boxes:', JSON.stringify(info, null, 2));

await browser.close();
