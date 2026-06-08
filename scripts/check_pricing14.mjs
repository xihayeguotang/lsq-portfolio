import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('http://localhost:3000/portfolio/tv', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Click VIP button
const els = await page.$$('[class*="cursor-pointer"]');
for (const el of els) {
  const box = await el.boundingBox();
  if (box && Math.abs(box.y - 355) < 10 && box.x > 520 && box.x < 600) {
    await el.click();
    break;
  }
}
await page.waitForTimeout(2000);

// Now hover on the second pricing plan by hovering over the SVG badge area
// SVG index 4 is plan 2's badge SVG at roughly y: 694
const plan2Badge = (await page.$$('svg'))[4];
if (plan2Badge) {
  const box = await plan2Badge.boundingBox();
  if (box) {
    // Hover over the badge area (also hovers the parent plan row)
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(500);
    console.log('Hovered on plan 2 badge');
  }
}

// Take screenshot
await page.screenshot({ path: '/tmp/plan2_hovered.png' });

// Get all visible SVG elements on hover
const hoverDetails = await page.evaluate(() => {
  const svgs = document.querySelectorAll('svg');
  return Array.from(svgs).map((svg, i) => ({
    index: i,
    innerHTML: svg.innerHTML.substring(0, 80),
    childTypes: Array.from(svg.children).map(c => c.tagName),
    rect: svg.getBoundingClientRect(),
  }));
});
console.log('Hover SVG details:', JSON.stringify(hoverDetails, null, 2));

await browser.close();
