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

// Get the bounding box of the pricing section
const rect = await page.evaluate(() => {
  const allText = document.body.innerText;
  // Find the first plan by looking for all plan rows
  const pricingDivs = [];
  const allDivs = document.querySelectorAll('div');
  for (const div of allDivs) {
    if (div.textContent && div.textContent.includes('1年卡') && !div.textContent.includes('2年卡')) {
      const parent = div.parentElement;
      if (parent && parent.children.length >= 2) {
        const p = parent.parentElement;
        if (p) {
          const pp = p.parentElement;
          if (pp) return pp.getBoundingClientRect();
        }
      }
    }
  }
  return null;
});

if (rect) {
  await page.screenshot({ 
    path: '/tmp/pricing_zoom.png',
    clip: { x: Math.max(0, rect.x - 20), y: Math.max(0, rect.y - 20), width: rect.width + 40, height: rect.height + 40 }
  });
  console.log('Zoomed screenshot saved');
} else {
  console.log('Could not find pricing section, taking full screenshot');
  await page.screenshot({ path: '/tmp/pricing_fallback.png' });
}

await browser.close();
