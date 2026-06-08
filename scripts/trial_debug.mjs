import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

// Go directly to a portfolio item that has the TV sim
await page.goto('http://localhost:3000/portfolio/zhihu-baike-tv', { waitUntil: 'networkidle', timeout: 30000 });
console.log('Page loaded: ' + page.url());

// Take screenshot of full page
await page.screenshot({ path: '/tmp/tv_page_full.png', fullPage: true });
console.log('Full page screenshot saved');

// Scroll to find the TV simulator
// The TV sim is scaled by 0.6, centered in the viewport
await page.evaluate(() => {
  // Find elements with text that looks like category names
  const allText = document.body.innerText;
  console.log('Page text sample:', allText.substring(0, 500));
});

// Take viewport screenshot
await page.screenshot({ path: '/tmp/tv_viewport.png' });
console.log('Viewport screenshot saved');

// Look for clickable elements in the TV simulator
const tvSim = await page.$('[class*="TvSim"], [class*="tv"], #tv-sim');
console.log('TvSim found:', !!tvSim);

await browser.close();
