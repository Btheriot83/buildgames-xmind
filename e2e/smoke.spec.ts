import { expect, test } from '@playwright/test'

test('core loop: load sample, add child, export svg', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('mind-canvas')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByTestId('map-title')).toBeVisible()

  const nodesBefore = await page.locator('.map-node').count()
  expect(nodesBefore).toBeGreaterThanOrEqual(1)

  await page.getByTestId('add-child').click()
  await expect.poll(async () => page.locator('.map-node').count()).toBeGreaterThan(nodesBefore)

  const downloadPromise = page.waitForEvent('download')
  await page.getByTestId('export-svg').click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toMatch(/\.svg$/i)

  await expect(page.locator('.success-overlay.visible')).toBeVisible()
})

test('outline panel opens and sibling control exists', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('mind-canvas')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByTestId('add-sibling')).toBeVisible()
  await expect(page.getByTestId('ai-expand')).toBeVisible()
  await page.getByTestId('open-outline').click()
  await expect(page.getByTestId('outline-input')).toBeVisible()
})

test('onboarding: skip then no replay', async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('scm-onboard-v1'))
  await page.goto('/')
  await expect(page.getByTestId('mind-canvas')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByTestId('onboarding')).toBeVisible()
  await page.getByTestId('onboard-skip').click()
  await expect(page.getByTestId('onboarding')).toHaveCount(0)
  await expect(page.getByTestId('map-title')).toHaveValue(/Week of hooks|Untitled/)
  await page.reload()
  await expect(page.getByTestId('mind-canvas')).toBeVisible({ timeout: 30_000 })
  await expect(page.getByTestId('onboarding')).toHaveCount(0)
})

test('onboarding: complete all cards', async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('scm-onboard-v1'))
  await page.goto('/')
  await expect(page.getByTestId('onboarding')).toBeVisible({ timeout: 30_000 })
  for (let i = 0; i < 4; i++) {
    await page.getByTestId('onboard-next').click()
  }
  await expect(page.getByTestId('onboarding')).toHaveCount(0)
  await expect(page.getByTestId('mind-canvas')).toBeVisible()
})
