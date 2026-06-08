import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

// Go to the app
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
console.log('Page loaded');

// Take screenshot of home page
await page.screenshot({ path: '/tmp/home.png' });

// Click on a theme card to enter player
// Look for clickable elements that might be theme cards
const cards = await page.$$('[class*="card"], [class*="Card"], a, button');
console.log(`Found ${cards.length} clickable elements`);

// Try clicking the first prominent button/card
const firstCard = await page.$('a, button, [role="button"]');
if (firstCard) {
  await firstCard.click();
  console.log('Clicked');
  await page.waitForTimeout(3000);
}

// Take screenshot of next page
await page.screenshot({ path: '/tmp/after_click.png' });
console.log('After click screenshot saved');

await browser.close();
