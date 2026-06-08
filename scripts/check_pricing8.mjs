import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('http://localhost:3000/portfolio/tv', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Get all the rendered text
const text = await page.evaluate(() => document.body.innerText);
console.log('All page text:', text.substring(0, 2000));

// Check for any interactive SVG elements or buttons  
const buttons = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('button, [role="button"], a')).map(b => ({
    text: b.textContent?.trim().substring(0, 40),
    tag: b.tagName,
    visible: b.offsetParent !== null,
    rect: b.getBoundingClientRect(),
  }));
});
console.log('Buttons:', JSON.stringify(buttons, null, 2));

await page.screenshot({ path: '/tmp/tv_page_full.png', fullPage: true });
console.log('Full page screenshot saved');

await browser.close();
