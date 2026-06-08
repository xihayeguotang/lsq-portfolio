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

// Get the HTML around "2年卡" text node, including parent structure
const result = await page.evaluate(() => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.textContent?.trim() === '2年卡') {
      const parent = node.parentElement;
      // Get the parent's full HTML (cleaned up)
      const getFullHtml = (el, depth = 0) => {
        if (depth > 5) return { tag: el.tagName, text: el.textContent?.substring(0, 50) };
        const children = Array.from(el.children).map(c => getFullHtml(c, depth + 1));
        return {
          tag: el.tagName,
          style: el.getAttribute('style')?.substring(0, 150),
          childCount: el.children.length,
          children,
        };
      };
      return {
        grandParent: getFullHtml(parent.parentElement),
        parentTag: parent.tagName,
        parentStyle: parent.getAttribute('style')?.substring(0, 200),
        parentChildren: Array.from(parent.children).map(c => ({
          tag: c.tagName,
          style: c.getAttribute('style')?.substring(0, 100),
          hasSvg: c.querySelector('svg') !== null,
          textContent: c.textContent?.substring(0, 30),
          childCount: c.children.length,
          rect: c.getBoundingClientRect(),
        })),
        nodeRect: node.parentElement?.getBoundingClientRect(),
        nextSibling: node.parentElement?.nextElementSibling?.textContent?.substring(0, 30),
      };
    }
  }
  return 'NOT FOUND';
});

console.log(JSON.stringify(result, null, 2));

await browser.close();
