import { test, expect } from '@playwright/test';

test('checkout flow stub', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /collections/i })).toBeVisible();

    // TODO: seed and create a user, then perform full checkout assertions.
});

