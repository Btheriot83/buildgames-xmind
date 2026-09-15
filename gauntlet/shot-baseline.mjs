import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('gauntlet/shots', { recursive: true });
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

async function shot(url, path, waitMs=3000) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 });
    await page.waitForTimeout(waitMs);
    await page.screenshot({ path, fullPage: false });
    console.log('ok', path);
  } catch (e) {
    console.error('fail', url, e.message);
  }
}

await shot('https://buildgames-xmind.vercel.app/', 'gauntlet/shots/r0-demo.png', 4000);
await shot('https://xmind.app/', 'gauntlet/shots/r0-bar-home.png', 4500);
await shot('https://xmind.com/features', 'gauntlet/shots/r0-bar-features.png', 4500);
await browser.close();
