import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('http://localhost:3000/portfolio/tv', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Take a wider screenshot 
await page.screenshot({ path: '/tmp/tv_full.png', fullPage: false });

// Find clickable elements in the main simulation area
const clickables = await page.evaluate(() => {
  const results = [];
  const allEls = document.querySelectorAll('[class*="cursor-pointer"], [onClick], button, [role="button"]');
  for (const el of allEls) {
    const rect = el.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0 && rect.y < 1000) {
      results.push({
        tag: el.tagName,
        cls: el.className?.substring(0, 40),
        x: rect.x, y: rect.y, w: rect.width, h: rect.height,
        text: el.textContent?.trim().substring(0, 20),
      });
    }
  }
  return results.slice(0, 30);
});

console.log('Clickable elements:', JSON.stringify(clickables, null, 2));

await browser.close();
