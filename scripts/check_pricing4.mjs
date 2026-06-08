import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);

// Click to navigate to the TV sim page - look for links/buttons
const links = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('a, button, [role="button"]')).map(el => ({
    text: el.textContent?.trim().substring(0, 30),
    href: el.href || '',
    tag: el.tagName,
    rect: el.getBoundingClientRect(),
  }));
});
console.log('Links:', JSON.stringify(links, null, 2));

// Try clicking a link that looks like the TV sim
const tvLink = await page.$('a[href*="tv"], a[href*="sim"], a:has-text("TV"), a:has-text("模拟")');
if (tvLink) {
  await tvLink.click();
  await page.waitForTimeout(3000);
  const pageText = await page.evaluate(() => document.body.innerText.substring(0, 1000));
  console.log('After click text:', JSON.stringify(pageText));
  await page.screenshot({ path: '/tmp/pricing_debug.png' });
}

await browser.close();
