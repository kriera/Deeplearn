import { test, expect } from '@playwright/test'

test.describe('DeepLearn — Critical User Flow', () => {
  test('complete Feynman learning path: concept entry → level → quiz → completion', async ({
    page,
  }) => {
    await page.goto('/')

    // 1. Concept Entry Page — should show the hero and input
    await expect(page.locator('h1')).toContainText('Stop just reading')
    await expect(page.locator('#concept-input')).toBeVisible()

    // Type a concept
    await page.fill('#concept-input', 'Quantum mechanics')
    await page.click('button:has-text("Generate Your Learning Path")')

    // 2. Level Page — should show level 1 explanation
    await expect(page.locator('text=Level 1')).toBeVisible({ timeout: 15000 })
    await expect(page.locator('text=Elemental Overview')).toBeVisible()

    // Click "Take the Quiz"
    await page.click('button:has-text("Take the Quiz")')

    // 3. Quiz Page — should show 5 questions
    await expect(page.locator('text=Question 1 of 5')).toBeVisible({ timeout: 10000 })

    // Answer all 5 questions (click first option for each)
    for (let i = 0; i < 5; i++) {
      const questionCards = page.locator('.glass.rounded-3xl.p-6')
      const card = questionCards.nth(i)
      await card.locator('button').first().click()
    }

    // Submit
    await page.click('button:has-text("Submit Answers")')

    // 4. Results — should show score
    await expect(page.locator('text=scored')).toBeVisible({ timeout: 10000 })
  })

  test('fail path: retry quiz after failing', async ({ page }) => {
    await page.goto('/')
    await page.fill('#concept-input', 'Test concept')
    await page.click('button:has-text("Generate Your Learning Path")')

    // Wait for level page
    await expect(page.locator('text=Level 1')).toBeVisible({ timeout: 15000 })
    await page.click('button:has-text("Take the Quiz")')

    // Wait for quiz
    await expect(page.locator('text=Question 1 of 5')).toBeVisible({ timeout: 10000 })

    // Answer only 2 questions (not enough to pass)
    const questionCards = page.locator('.glass.rounded-3xl.p-6')
    await questionCards.nth(0).locator('button').first().click()
    await questionCards.nth(1).locator('button').first().click()

    await page.click('button:has-text("Submit Answers")')

    // Should show "Keep Trying" or "Try Again"
    await expect(page.locator('text=Try Again')).toBeVisible({ timeout: 10000 })
  })

  test('navigation: back to home from level page', async ({ page }) => {
    await page.goto('/')
    await page.fill('#concept-input', 'Navigation test')
    await page.click('button:has-text("Generate Your Learning Path")')

    await expect(page.locator('text=Level 1')).toBeVisible({ timeout: 15000 })

    // Click "Home" back button
    await page.click('button:has-text("Home")')

    // Should be back on entry page
    await expect(page.locator('#concept-input')).toBeVisible()
  })
})
