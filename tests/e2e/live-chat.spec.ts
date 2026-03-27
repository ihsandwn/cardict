import { test, expect } from '@playwright/test';

test('live chat page stub', async ({ page }) => {
    await page.goto('/live-chat');

    // TODO: authenticate user before visiting live chat, then assert realtime message append.
    await expect(page).toHaveURL(/login|live-chat/);
});

