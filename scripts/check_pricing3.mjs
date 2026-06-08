import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Check what's visible on the page
const text = await page.evaluate(() => document.body.innerText.substring(0, 500));
console.log('Page text:', JSON.stringify(text));

// Check HTML structure
const html = await page.evaluate(() => document.querySelector('#__next')?.innerHTML?.substring(0, 3000));
console.log('Next.js HTML:', JSON.stringify(html));

const screenshot = await page.screenshot({ path: '/tmp/pricing_debug.png' });
console.log('Screenshot saved');

await browser.close();
