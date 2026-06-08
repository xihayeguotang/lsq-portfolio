import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Click "查看作品"
await page.click('button:has-text("查看作品")');
await page.waitForTimeout(3000);

const pageText = await page.evaluate(() => document.body.innerText.substring(0, 2000));
console.log('After click page text:', JSON.stringify(pageText));

// Take screenshot
await page.screenshot({ path: '/tmp/after_works.png' });

// Look for links/buttons that might lead to TV sim
const interactive = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('a, button, [role="button"], [class*="card"], [class*="Card"]')).slice(0, 20).map(el => ({
    text: el.textContent?.trim().substring(0, 40),
    tag: el.tagName,
    cls: el.className?.substring(0, 60),
    rect: el.getBoundingClientRect(),
  }));
});
console.log('Interactive elements:', JSON.stringify(interactive, null, 2));

await browser.close();
