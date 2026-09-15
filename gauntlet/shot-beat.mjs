import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
mkdirSync('gauntlet/shots-beat', { recursive: true });
const name = process.argv[2] || 'beatN';
const alsoBar = process.argv.includes('--bar');
const base = process.env.SHOT_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(1600);
const diesel = page.getByTestId('load-sample');
if (await diesel.count()) {
  try { await diesel.click({ timeout: 2000 }); await page.waitForTimeout(900); } catch {}
}
const path = `gauntlet/shots-beat/${name}.png`;
await page.screenshot({ path, fullPage: false });
console.log('wrote', path);
if (alsoBar) {
  const bar = await ctx.newPage();
  try {
    await bar.goto('https://xmind.app/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await bar.waitForTimeout(2800);
    const bpath = `gauntlet/shots-beat/${name.replace(/board|demo/, 'bar').replace(/beat(\d+)/, 'beat$1-bar')}-xmind.png`;
    // simpler naming
    const barPath = `gauntlet/shots-beat/${name.includes('beat') ? name.split('-')[0] : name}-bar-xmind.png`;
    await bar.screenshot({ path: barPath, fullPage: false });
    console.log('wrote', barPath);
  } catch (e) {
    console.error('bar shot failed', e.message);
  }
}
await browser.close();
