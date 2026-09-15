import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('gauntlet/shots-r5', { recursive: true });
const round = process.argv[2] || 'rN';
const alsoBar = process.argv.includes('--bar');
const base = process.env.SHOT_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(1600);
const diesel = page.getByTestId('load-sample');
if (await diesel.count()) {
  try { await diesel.click({ timeout: 2000 }); await page.waitForTimeout(800); } catch {}
}
const path = `gauntlet/shots-r5/${round}-board.png`;
await page.screenshot({ path, fullPage: false });
console.log('wrote', path);
if (alsoBar) {
  const bar = await ctx.newPage();
  try {
    await bar.goto('https://xmind.app/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await bar.waitForTimeout(2500);
    const bpath = `gauntlet/shots-r5/${round}-bar-xmind.png`;
    await bar.screenshot({ path: bpath, fullPage: false });
    console.log('wrote', bpath);
  } catch (e) {
    console.error('bar shot failed', e.message);
  }
}
await browser.close();
