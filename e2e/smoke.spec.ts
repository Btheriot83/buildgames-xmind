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
