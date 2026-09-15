import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'

const outA = 'gauntlet/shots-social-onboard'
const outB = '/workspace/build-games/gauntlet/shots-social-onboard'
fs.mkdirSync(outA, { recursive: true })
fs.mkdirSync(outB, { recursive: true })

const browser = await chromium.launch({ headless: true })
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await ctx.newPage()

await page.goto('https://buildgames-xmind.vercel.app/', { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.evaluate(() => {
  localStorage.setItem('scm-onboard-v1', JSON.stringify({ completed: true, step: 4 }))
})
await page.reload({ waitUntil: 'domcontentloaded' })
await page.waitForSelector('[data-testid="mind-canvas"]', { timeout: 60000 })
await page.waitForTimeout(1000)

// preset packs visible
await page.waitForSelector('[data-testid="preset-packs"]', { timeout: 15000 })
await page.screenshot({ path: path.join(outA, '05-presets-visible.png') })

await page.getByTestId('preset-reel-batch').click()
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(outA, '05b-preset-reel-batch.png') })

const body = await page.evaluate(() => document.body.innerText)
const bad = (body.match(/diesel|AZMDR|Copper Synapse|Yard trucks|Freightliner|Load diesel|\bDiesel\b/gi) || [])
console.log(JSON.stringify({
  badCount: bad.length,
  bad,
  hasPresets: await page.locator('[data-testid="preset-packs"]').count(),
  title: await page.locator('[data-testid="map-title"]').inputValue(),
  nodes: await page.locator('.map-node').count(),
}))

for (const f of fs.readdirSync(outA)) {
  fs.copyFileSync(path.join(outA, f), path.join(outB, f))
}
await browser.close()
console.log('copied', fs.readdirSync(outB))
