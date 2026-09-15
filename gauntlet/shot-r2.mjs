import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('gauntlet/shots', { recursive: true });
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'gauntlet/shots/r2-r1-diesel.png' });
await page.screenshot({ path: 'gauntlet/shots/r2-r10-board.png' });
// clear maps to show empty: delete via sidebar
const del = page.locator('.map-list .danger-text').first();
if (await del.count()) {
  await del.click();
  await page.waitForTimeout(800);
}
await page.screenshot({ path: 'gauntlet/shots/r2-r10-empty.png' });
await browser.close();
console.log('r2 shots ok');
