import { test, expect } from '@playwright/test';

test.describe('Resume Tailor E2E', () => {
  
  test('should log in and redirect to dashboard', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('form')).toBeVisible();
    await page.fill('input[type="text"]', 'admin');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Your Base Resume')).toBeVisible({ timeout: 10000 });
  });

  test('should signup, upload resume, and tailor', async ({ page }) => {
    // 1. Signup
    const randomUser = `user${Math.floor(Math.random() * 10000)}`;
    await page.goto('/signup');
    await page.fill('input[type="text"]', randomUser);
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('No Resume Found')).toBeVisible({ timeout: 10000 });

    // 2. Mock PDF Upload (Parse)
    await page.route('**/api/v1/users/me/parse-pdf', async route => {
      await route.fulfill({
        json: {
          contact_info: { 
            name: "Test User", 
            email: "test@example.com",
            location: "Test City",
            phone: "123-456-7890"
          },
          summary: "Experienced software engineer.",
          experience: [
            {
              position: "Software Engineer",
              company: "Tech Corp",
              start_date: "2020",
              end_date: "Present",
              description: ["Built things.", "Fixed bugs."]
            }
          ],
          education: [],
          skills: [{ category: "Tech", skills: ["Python", "React"] }],
          projects: []
        }
      });
    });

    // Trigger upload (we just need to trigger the event, the file doesn't matter since we mock the response)
    // We create a dummy file for the input
    await page.setInputFiles('input[type="file"]', {
      name: 'resume.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('dummy pdf content')
    });

    // Verify Resume Loaded
    await expect(page.getByText('Test User')).toBeVisible();
    await expect(page.getByText('Tech Corp')).toBeVisible();

    // 3. Tailor Resume
    const jd = "Looking for a Python expert.";
    await page.locator('textarea').fill(jd);
    
    // Mock Tailor Response (to save time/cost and avoid LLM latency)
    await page.route('**/api/v1/users/me/tailor', async route => {
      // Wait a bit to simulate processing
      await new Promise(r => setTimeout(r, 1000));
      await route.fulfill({
        json: {
          contact_info: { name: "Test User" },
          summary: "Tailored summary for Python expert.",
          experience: [],
          skills: []
        }
      });
    });

    // Mock PDF Generation
    await page.route('**/api/v1/generate-pdf', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('%PDF-1.4 dummy pdf')
      });
    });

    await page.click('button:has-text("Tailor Resume")');
    
    // Verify Loading
    await expect(page.getByText('Analyzing & Rewriting...')).toBeVisible();
    
    // Verify Success
    await expect(page.getByText('Tailored Resume Ready')).toBeVisible({ timeout: 10000 });
    
    // Verify PDF Viewer
    await expect(page.locator('.react-pdf__Document')).toBeVisible();
  });
});
