import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('http://localhost:3000/portfolio/tv', { waitUntil: 'networkidle' });
await page.waitForTimeout(3000);

// Get full HTML around the pricing section
const html = await page.evaluate(() => {
  // Find "2年卡" or "2" in text
  const allDivs = document.querySelectorAll('div');
  for (const div of allDivs) {
    if (div.textContent?.includes('2年卡')) {
      // Get this div and a few siblings/parents
      return {
        outerHTML: div.outerHTML.substring(0, 3000),
        childCount: div.children.length,
        className: div.className,
        style: div.getAttribute('style')?.substring(0, 200),
        parentChildren: div.parentElement?.children.length,
        parentChildrenHTML: Array.from(div.parentElement?.children || []).map(c => ({
          tag: c.tagName,
          text: c.textContent?.substring(0, 50),
          class: c.className?.substring(0, 50),
          style: c.getAttribute('style')?.substring(0, 100),
        })),
      };
    }
  }
  return 'NOT FOUND';
});

console.log(JSON.stringify(html, null, 2));

await browser.close();
