import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

// Get detailed info about the pricing DOM structure
const domInfo = await page.evaluate(() => {
  // Find all text containing "年卡"
  const allText = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ALL);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.nodeType === 1) {
      const el = node;
      const text = el.textContent || '';
      if (text.includes('年卡') && text.includes('2')) {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        allText.push({
          tag: el.tagName,
          text: text.substring(0, 50),
          x: rect.x, y: rect.y, w: rect.width, h: rect.height,
          zIndex: style.zIndex,
          position: style.position,
          overflow: style.overflow,
        });
        if (allText.length > 10) break;
      }
    }
  }
  return allText;
});

console.log('DOM info:', JSON.stringify(domInfo, null, 2));

// Now check the SVG badge areas for any overlapping
const badgeInfo = await page.evaluate(() => {
  const results = [];
  const allEls = document.querySelectorAll('*');
  for (const el of allEls) {
    const style = window.getComputedStyle(el);
    if (style.position === 'absolute' && el.textContent === '' && el.querySelector('svg')) {
      const rect = el.getBoundingClientRect();
      results.push({
        tag: el.tagName,
        x: rect.x, y: rect.y, w: rect.width, h: rect.height,
      });
    }
  }
  return results;
});

console.log('Absolutely positioned empty elements:', JSON.stringify(badgeInfo, null, 2));

// Check the left decorative SVGs
const svgInfo = await page.evaluate(() => {
  const svgs = document.querySelectorAll('svg, div[style*="backgroundImage"]');
  const results = [];
  for (const el of svgs) {
    if (el.tagName === 'DIV' && el.style?.backgroundImage?.includes('19e72f12')) {
      const rect = el.getBoundingClientRect();
      results.push({ tag: el.tagName, x: rect.x, y: rect.y, w: rect.width, h: rect.height, visible: rect.width > 0 && rect.height > 0 });
    }
  }
  return results;
});

console.log('Decorative SVGs:', JSON.stringify(svgInfo, null, 2));

await browser.screenshot({ path: '/tmp/pricing_debug.png' });
console.log('Screenshot saved');

await browser.close();
