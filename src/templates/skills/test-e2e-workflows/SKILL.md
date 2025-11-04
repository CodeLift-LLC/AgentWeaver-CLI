---
name: E2E Testing Workflows
description: End-to-end testing patterns with Playwright including test scenarios, page object model, and real user workflow automation.
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
tags:
  - testing
  - e2e
  - playwright
  - integration
  - automation
  - workflows
---

# E2E Testing Workflows Skill

Comprehensive patterns for end-to-end testing using Playwright, covering real user workflows, page object model, and best practices for reliable browser automation.

## When to Use

- Testing complete user journeys across your application
- Validating critical business workflows (checkout, signup, etc.)
- Ensuring UI components work correctly in real browsers
- Testing cross-browser compatibility
- Validating integrations between frontend and backend

## Core Concepts

### 1. What is E2E Testing?

E2E tests simulate real user interactions in a real browser environment:

- Navigate through pages like a real user
- Fill forms, click buttons, interact with UI
- Verify the entire system works together
- Test critical user paths from start to finish

### 2. E2E vs Unit vs Integration

```
Unit Tests:        Fast, isolated, many tests
                   ↓
Integration Tests: Medium speed, test modules together
                   ↓
E2E Tests:         Slower, test complete workflows, fewer but critical
```

**Golden Rule**: Few, focused E2E tests for critical paths. Use unit tests for comprehensive coverage.

## Page Object Model (POM)

The recommended pattern for organizing E2E tests.

### Why Use Page Objects?

- **Maintainability**: UI changes only require updates in one place
- **Reusability**: Share common actions across tests
- **Readability**: Tests read like user stories
- **Type Safety**: Get autocomplete and error checking

### Basic Page Object Example

```typescript
// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }
}
```

### Using Page Objects in Tests

```typescript
// tests/auth.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('Authentication', () => {
  test('user can login with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Navigate to login page
    await loginPage.goto();

    // Perform login
    await loginPage.login('user@example.com', 'password123');

    // Verify redirect to dashboard
    await expect(page).toHaveURL('/dashboard');
    await expect(dashboardPage.welcomeMessage).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login('wrong@example.com', 'wrongpass');

    // Verify error message
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Invalid credentials');
  });
});
```

## Common Test Scenarios

### 1. User Registration Flow

```typescript
test('new user can complete registration', async ({ page }) => {
  const signupPage = new SignupPage(page);
  const verificationPage = new VerificationPage(page);

  // Step 1: Fill registration form
  await signupPage.goto();
  await signupPage.fillForm({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'SecurePass123!'
  });

  // Step 2: Accept terms and submit
  await signupPage.acceptTerms();
  await signupPage.submit();

  // Step 3: Verify email sent message
  await expect(page).toHaveURL(/\/verify-email/);
  await expect(verificationPage.message).toContainText(
    'Check your email for verification link'
  );
});
```

### 2. E-commerce Checkout Flow

```typescript
test('user can complete purchase', async ({ page }) => {
  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Step 1: Add product to cart
  await productPage.goto('/products/laptop-123');
  await productPage.addToCart();

  // Step 2: Navigate to cart
  await page.goto('/cart');
  await expect(cartPage.items).toHaveCount(1);

  // Step 3: Proceed to checkout
  await cartPage.proceedToCheckout();

  // Step 4: Fill shipping information
  await checkoutPage.fillShippingInfo({
    address: '123 Main St',
    city: 'New York',
    zip: '10001'
  });

  // Step 5: Fill payment information
  await checkoutPage.fillPaymentInfo({
    cardNumber: '4242424242424242',
    expiry: '12/25',
    cvv: '123'
  });

  // Step 6: Complete purchase
  await checkoutPage.placeOrder();

  // Verify success
  await expect(page).toHaveURL(/\/order-confirmation/);
  await expect(page.getByText('Order confirmed')).toBeVisible();
});
```

### 3. Form Validation Flow

```typescript
test('validates form fields before submission', async ({ page }) => {
  const contactPage = new ContactPage(page);

  await contactPage.goto();

  // Try to submit empty form
  await contactPage.submitButton.click();

  // Verify validation errors
  await expect(contactPage.emailError).toContainText('Email is required');
  await expect(contactPage.messageError).toContainText('Message is required');

  // Fill valid data
  await contactPage.emailInput.fill('user@example.com');
  await contactPage.messageInput.fill('Hello, I need help');

  // Verify errors disappear
  await expect(contactPage.emailError).not.toBeVisible();

  // Submit form
  await contactPage.submitButton.click();
  await expect(page.getByText('Message sent successfully')).toBeVisible();
});
```

## Advanced Page Object Patterns

### Composable Page Objects

```typescript
// Base page with common functionality
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async screenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}

// Extend base page
export class ProductPage extends BasePage {
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
  }

  async addToCart() {
    await this.addToCartButton.click();
    await this.waitForPageLoad();
  }
}
```

### Component Objects

```typescript
// Reusable components
export class Header {
  readonly page: Page;
  readonly cartIcon: Locator;
  readonly searchInput: Locator;
  readonly userMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartIcon = page.getByRole('link', { name: 'Cart' });
    this.searchInput = page.getByPlaceholder('Search products');
    this.userMenu = page.getByRole('button', { name: 'Account' });
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async openCart() {
    await this.cartIcon.click();
  }
}

// Use component in page object
export class HomePage {
  readonly page: Page;
  readonly header: Header;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
  }
}
```

## Best Practices

### 1. Use Reliable Selectors

```typescript
// ✅ Good: Semantic selectors (accessible)
page.getByRole('button', { name: 'Submit' })
page.getByLabel('Email address')
page.getByText('Welcome back')
page.getByPlaceholder('Enter your email')

// ⚠️ Okay: Test IDs (when needed)
page.getByTestId('submit-button')

// ❌ Bad: Fragile selectors
page.locator('.btn-primary.submit') // Breaks with CSS changes
page.locator('div > button:nth-child(2)') // Breaks with structure changes
```

### 2. Wait for Elements Properly

```typescript
// ✅ Good: Auto-waiting with assertions
await expect(page.getByText('Success')).toBeVisible();

// ✅ Good: Explicit waits when needed
await page.waitForURL('/dashboard');
await page.waitForLoadState('networkidle');

// ❌ Bad: Arbitrary timeouts
await page.waitForTimeout(3000); // Flaky!
```

### 3. Handle Dynamic Content

```typescript
// Wait for API calls to complete
await page.waitForResponse(response =>
  response.url().includes('/api/products') && response.status() === 200
);

// Wait for loading states
await expect(page.getByTestId('loading-spinner')).toBeHidden();
await expect(page.getByText('Products loaded')).toBeVisible();
```

### 4. Test Data Management

```typescript
// Use fixtures for consistent test data
test.beforeEach(async ({ page }) => {
  // Seed database with test data
  await setupTestData({
    users: [
      { email: 'test@example.com', password: 'password123' }
    ],
    products: [
      { id: 1, name: 'Laptop', price: 999 }
    ]
  });
});

test.afterEach(async () => {
  // Clean up test data
  await cleanupTestData();
});
```

### 5. Authentication State Reuse

```typescript
// Save authentication state once
test('setup auth', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Save state
  await page.context().storageState({ path: 'auth.json' });
});

// Reuse in other tests
test.use({ storageState: 'auth.json' });

test('protected page works', async ({ page }) => {
  await page.goto('/dashboard'); // Already authenticated!
});
```

## Error Handling and Debugging

### Screenshots on Failure

```typescript
// playwright.config.ts
export default {
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  }
};
```

### Debug Mode

```typescript
// Run with debugger
test('debug this test', async ({ page }) => {
  await page.pause(); // Opens Playwright Inspector
  await page.goto('/');
});
```

### Custom Error Messages

```typescript
test('order total is correct', async ({ page }) => {
  const total = await page.getByTestId('order-total').textContent();

  expect(total, 'Order total should include tax and shipping').toBe('$129.99');
});
```

## Testing Checklist

- [ ] Tests cover critical user journeys
- [ ] Page objects are used for maintainability
- [ ] Selectors are semantic and accessible
- [ ] Tests wait for elements properly (no arbitrary timeouts)
- [ ] Tests are independent and can run in parallel
- [ ] Authentication state is reused when possible
- [ ] Test data is properly set up and cleaned up
- [ ] Screenshots/videos captured on failure
- [ ] Tests work across different browsers (if needed)
- [ ] Flaky tests are investigated and fixed

## Common Pitfalls

❌ **Don't**: Use hardcoded waits (`waitForTimeout`)
✅ **Do**: Use auto-waiting and explicit conditions

❌ **Don't**: Use fragile CSS selectors
✅ **Do**: Use semantic selectors (role, label, text)

❌ **Don't**: Write too many E2E tests
✅ **Do**: Focus on critical paths, use unit tests for details

❌ **Don't**: Share state between tests
✅ **Do**: Make each test independent

❌ **Don't**: Ignore flaky tests
✅ **Do**: Investigate and fix root causes

## Playwright Commands

```bash
# Run all tests
npx playwright test

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test auth.spec.ts

# Run in debug mode
npx playwright test --debug

# Run with UI mode
npx playwright test --ui

# Generate test code
npx playwright codegen https://example.com

# Show test report
npx playwright show-report

# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
```

## References

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Test Generator](https://playwright.dev/docs/codegen)
- [Selectors Guide](https://playwright.dev/docs/selectors)
- [Authentication Guide](https://playwright.dev/docs/auth)
