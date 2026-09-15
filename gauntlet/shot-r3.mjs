import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('gauntlet/shots', { recursive: true });
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(1800);
// ensure diesel map visible
const diesel = page.getByTestId('load-sample');
if (await diesel.count()) {
  try { await diesel.click({ timeout: 2000 }); await page.waitForTimeout(900); } catch {}
}
await page.screenshot({ path: 'gauntlet/shots/r3-board.png', fullPage: false });
// select root for button state
const root = page.locator('.map-node.is-root').first();
if (await root.count()) await root.click({ force: true });
await page.waitForTimeout(400);
await page.screenshot({ path: 'gauntlet/shots/r3-selected.png', fullPage: false });
// empty state
const del = page.locator('.map-list .danger-text').first();
if (await del.count()) {
  await del.click();
  await page.waitForTimeout(800);
}
await page.screenshot({ path: 'gauntlet/shots/r3-empty.png', fullPage: false });
await browser.close();
console.log('r3 shots ok');
