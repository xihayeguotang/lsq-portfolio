import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

// Enable Chrome DevTools Protocol for layer inspection
const session = await page.context().newCDPSession(page);

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

// Hover on plan 2's badge area
const svgs = await page.$$('svg');
if (svgs.length >= 5) {
  const box = await svgs[4].boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(500);
  }
}

// Get compositing layers
const layers = await session.send('LayerTree.compositingReasons');
console.log('Layer tree result type:', typeof layers);
console.log('Layer tree keys:', layers ? Object.keys(layers) : 'null');

// Try to get layer tree
try {
  const layerTree = await session.send('LayerTree.layerTreeDidChange');
  console.log('Layer tree changed');
} catch (e) {
  console.log('Layer tree error:', e.message.substring(0, 100));
}

// Get the snapshot of the compositing layers
const layerData = await session.send('LayerTree.loadSnapshot', {
  tiles: [{ x: 0, y: 0, sourceRect: { x: 0, y: 0, width: 1920, height: 1080 } }]
});
console.log('Layer snapshot:', JSON.stringify(layerData).substring(0, 200));

// Instead, let's check what CSS properties are causing compositing on elements near 2年卡
const compositingInfo = await page.evaluate(() => {
  // Find elements near 2年卡 text
  const results = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.textContent?.includes('2年卡')) {
      const parent = node.parentElement;
      // Check the parent chain for compositing-triggering CSS
      let el = parent;
      for (let i = 0; i < 15; i++) {
        if (!el) break;
        const style = window.getComputedStyle(el);
        const triggers = [];
        if (style.position === 'absolute') triggers.push('absolute');
        if (style.position === 'relative') triggers.push('relative');
        if (style.position === 'fixed') triggers.push('fixed');
        if (style.overflow === 'hidden') triggers.push('overflow:hidden');
        if (style.borderRadius !== '0px' && style.borderRadius !== '') triggers.push('borderRadius:' + style.borderRadius);
        if (style.willChange !== 'auto') triggers.push('willChange:' + style.willChange);
        if (style.transform !== 'none') triggers.push('transform');
        if (style.opacity !== '1') triggers.push('opacity:' + style.opacity);
        if (style.backfaceVisibility === 'hidden') triggers.push('backfaceVisibility:hidden');
        if (style.mixBlendMode !== 'normal') triggers.push('mixBlendMode:' + style.mixBlendMode);
        if (style.zIndex !== 'auto') triggers.push('zIndex:' + style.zIndex);
        results.push({
          depth: i,
          tag: el.tagName,
          triggers: triggers,
          rect: el.getBoundingClientRect(),
          hasBackgroundImg: !!el.style.backgroundImage && el.style.backgroundImage !== 'none',
        });
        el = el.parentElement;
      }
      break;
    }
  }
  return results;
});

console.log('Compositing info:', JSON.stringify(compositingInfo, null, 2));

await browser.close();
