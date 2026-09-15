import { chromium } from 'playwright'
import { mkdirSync, statSync } from 'fs'
mkdirSync('gauntlet/shots-elevate', { recursive: true })
const name = process.argv[2] || 'elevateN'
const url = process.argv[3] || process.env.SHOT_URL || 'http://127.0.0.1:4173/'
const browser = await chromium.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--single-process'],
})
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  page.setDefaultTimeout(30000)
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.waitForTimeout(1600)
  if (/127\.0\.0\.1|localhost|buildgames-xmind/.test(url)) {
    try {
      const diesel = page.getByTestId('load-sample')
      if (await diesel.count()) {
        await diesel.first().click({ timeout: 2500 })
        await page.waitForTimeout(900)
      }
    } catch {}
  }
  const path = `gauntlet/shots-elevate/${name}.png`
  await page.screenshot({ path, animations: 'disabled' })
  console.log('ok', path, statSync(path).size)
} finally {
  await browser.close()
}
