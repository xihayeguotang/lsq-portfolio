import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('http://localhost:3000/portfolio/zhihu-baike-tv', { waitUntil: 'networkidle', timeout: 30000 });
console.log('Page loaded');

// Scroll down to TV simulator section
await page.evaluate(() => window.scrollTo(0, 500));
await page.waitForTimeout(1000);

// Save initial state
await page.screenshot({ path: '/tmp/tv_scrolled.png' });

// The TV sim is in a scaled container. Find text inside it
// Categories: 史记, 微生物, 植物, 昆虫, etc.
// Try clicking on "史记" text
try {
  const shiji = page.locator('text=史记').first();
  await shiji.click({ timeout: 5000 });
  console.log('Clicked 史记');
} catch(e) {
  console.log('Could not click 史记:', e.message);
}

await page.waitForTimeout(3000);
await page.screenshot({ path: '/tmp/tv_after_click.png' });

// Now we should be in the player screen
// Wait for trial to end (15 seconds)
console.log('Waiting 18 seconds for trial...');
await page.waitForTimeout(18000);
await page.screenshot({ path: '/tmp/tv_trial_end.png' });
console.log('Trial ended screenshot saved');

await browser.close();
