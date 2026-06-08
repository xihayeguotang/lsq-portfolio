import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('http://localhost:3000/portfolio/tv', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Click the VIP button (the empty one at x:558, y:355 area)
// It's the second button in the row at y~355
const els = await page.$$('[class*="cursor-pointer"]');
for (const el of els) {
  const box = await el.boundingBox();
  if (box && Math.abs(box.y - 355) < 10 && box.x > 520 && box.x < 600) {
    await el.click();
    break;
  }
}
await page.waitForTimeout(2000);

// Take screenshot after clicking VIP
await page.screenshot({ path: '/tmp/vip_screen.png' });
console.log('VIP screen screenshot taken');

// Check if "2年卡" or pricing text is now visible
const text = await page.evaluate(() => document.body.innerText);
console.log('Page text after VIP click:', text.substring(0, 1500));

await browser.close();
