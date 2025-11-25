import { test, expect } from '@playwright/test';

test.describe('Resume Tailor E2E', () => {
  
  test('should log in and redirect to dashboard', async ({ page }) => {
    // 1. Navigate to Login
    await page.goto('/login');
    await expect(page).toHaveTitle(/Resume Tailor/);
    
    // 2. Fill Login Form
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    
    // 3. Submit
    await page.click('button[type="submit"]');
    
    // 4. Verify Redirect
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Your Base Resume')).toBeVisible();
  });

  test('should tailor resume', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');

    // 5. Enter Job Description
    const jd = `
      We are looking for a Senior Software Engineer.
      Must have experience with Python, FastAPI, and AWS Bedrock.
    `;
    await page.fill('textarea', jd);
    
    // 6. Click Tailor
    const tailorButton = page.locator('button:has-text("Tailor Resume")');
    await tailorButton.click();
    
    // 7. Verify tailoring process started - button text should change
    await expect(page.getByText('Analyzing & Rewriting...')).toBeVisible({ timeout: 5000 });
    
    // 8. Wait for the loading text to disappear (process completes)
    await expect(page.getByText('Analyzing & Rewriting...')).not.toBeVisible({ timeout: 120000 });
    
    // 9. Now verify success state appears
    await expect(
      page.getByRole('heading', { name: /Tailored Resume Ready/i })
    ).toBeVisible({ timeout: 10000 });
    
    // 10. Verify we can download the PDF
    await expect(page.getByRole('link', { name: /Download PDF/i })).toBeVisible();
  });
});
