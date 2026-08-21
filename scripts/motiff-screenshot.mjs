import { chromium } from "playwright-core";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("https://beta.miaoduo.com/file/kyA440a8UmIOIcVKLknS72N?nodeId=0%3A1&type=design", {
  waitUntil: "networkidle",
  timeout: 30000,
});
await page.waitForTimeout(5000);
await page.screenshot({ path: "/Users/liangsongquan/Desktop/motiff-design.png", fullPage: false });
await browser.close();
console.log("Screenshot saved");
