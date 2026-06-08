import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

// Navigate directly to the TV portfolio page
await page.goto('http://localhost:3000/portfolio/tv', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

const pageText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
console.log('TV page text:', JSON.stringify(pageText));

await page.screenshot({ path: '/tmp/tv_page.png' });
console.log('TV page screenshot saved');

// Look for "2年卡" in the DOM
const has2NianKa = await page.evaluate(() => {
  const body = document.body;
  return body.innerHTML.includes('2年卡');
});
console.log('Has 2年卡:', has2NianKa);

await browser.close();
