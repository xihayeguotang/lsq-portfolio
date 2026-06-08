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

// NOW HOVER over the 2nd plan to trigger the hover state
const hover2ndPlan = await page.evaluate(() => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.textContent?.includes('2年卡')) {
      const parent = node.parentElement;
      // Trigger hover on the plan row container (8 levels up)
      let el = parent;
      for (let i = 0; i < 8; i++) {
        if (el.parentElement) el = el.parentElement;
      }
      el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      return 'hovered';
    }
  }
  return 'not found';
});

console.log('Hover result:', hover2ndPlan);
await page.waitForTimeout(500);

// Now take screenshot
await page.screenshot({ path: '/tmp/vip_hovered.png' });
console.log('Hover screenshot taken');

// Also search for "减去" in all HTML
const hasSubtract = await page.evaluate(() => {
  return document.body.innerHTML.includes('减去');
});
console.log('Has "减去" in HTML:', hasSubtract);

// Check all SVG elements for their inner SVG content
const svgDetails = await page.evaluate(() => {
  const svgs = document.querySelectorAll('svg');
  return Array.from(svgs).map((svg, i) => ({
    index: i,
    width: svg.getAttribute('width'),
    height: svg.getAttribute('height'),
    innerHTML: svg.innerHTML.substring(0, 100),
    childCount: svg.children.length,
    rect: svg.getBoundingClientRect(),
  }));
});
console.log('SVG details:', JSON.stringify(svgDetails, null, 2));

await browser.close();
