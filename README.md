# Playwright E2E Test Suite

A full end-to-end test suite for the [Swag Labs](https://www.saucedemo.com) demo e-commerce application, built with Playwright and TypeScript. It covers all critical user flows — login, product browsing, cart management, and checkout — and is designed to demonstrate professional test automation patterns used in real-world projects.

## What's Covered

- **Page Object Model (POM)** architecture — UI interactions are encapsulated in page classes, keeping tests clean and maintainable
- **Reusable helpers and fixtures** — shared setup logic (login, add to cart) is written once and reused across all tests
- **Data-driven tests** — test data lives in JSON fixture files; products and checkout scenarios are loaded at runtime
- **Visual regression testing** — full-page screenshot comparisons catch unintended UI changes
- **GitHub Actions CI pipeline** — tests run automatically on every push and pull request
- **HTML test reports** — a detailed report with steps, screenshots, and traces is generated after every run
- **Cross-browser testing** — Chromium, Firefox, and WebKit (Safari engine)

## Tech Stack

| Tool | Purpose |
|---|---|
| [Playwright](https://playwright.dev) | Browser automation and test runner |
| TypeScript | Type-safe test code |
| GitHub Actions | CI/CD pipeline |
| HTML Reporter | Test result reports |

## Project Structure

```
playwright-e2e/
├── .github/
│   └── workflows/
│       └── playwright.yml        # CI pipeline (runs on push/PR)
│
├── fixtures/                     # Static test data (JSON)
│   ├── users.json                # Login credentials for each user type
│   ├── products.json             # Product catalogue (names, prices)
│   └── checkout-data.json        # Valid and invalid checkout form data
│
├── pages/                        # Page Object Model classes
│   ├── base.page.ts              # Shared base class (navigate, getTitle)
│   ├── login.page.ts             # Login page interactions
│   ├── inventory.page.ts         # Product listing page interactions
│   ├── cart.page.ts              # Shopping cart interactions
│   └── checkout.page.ts          # Checkout flow interactions
│
├── helpers/                      # Reusable workflow functions
│   ├── auth.helper.ts            # loginAs()
│   └── cart.helper.ts            # addToCart(), fillCheckoutForm(), clearCart()
│
├── test-fixtures/
│   └── index.ts                  # Custom Playwright fixtures (POM injection)
│
├── tests/                        # Test spec files
│   ├── login.spec.ts             # Authentication tests (8 tests)
│   ├── products.spec.ts          # Product browsing tests (16 tests)
│   ├── cart.spec.ts              # Cart management tests (9 tests)
│   ├── checkout.spec.ts          # Checkout flow tests (9 tests)
│   └── visual.spec.ts            # Visual regression tests (4 tests)
│
├── playwright.config.ts          # Playwright configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json
```

## Prerequisites

- [Node.js](https://nodejs.org) v18 or higher
- npm (comes with Node.js)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/playwright-e2e.git
cd playwright-e2e
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

This downloads Chromium, Firefox, and WebKit. The first run takes a few minutes.

### 4. Run all tests

```bash
npm test
```

### 5. View the HTML report

```bash
npm run report
```

This opens an interactive report in your browser showing pass/fail status, test steps, screenshots on failure, and traces.

## Running Tests

### All tests (all 3 browsers in parallel)

```bash
npm test
```

### Single browser

```bash
npm run test:chrome
npm run test:firefox
npm run test:webkit
```

### Interactive UI mode (recommended for debugging)

```bash
npm run test:ui
```

Opens Playwright's built-in UI where you can click through tests, watch them run in real time, inspect each step, and view the DOM at any point.

### Headed mode (visible browser window)

```bash
npm run test:headed
```

### A specific test file

```bash
npx playwright test tests/checkout.spec.ts
```

### A specific test by name

```bash
npx playwright test -g "completes checkout successfully"
```

## Visual Regression Tests

Visual regression tests compare the current UI against stored baseline screenshots. Baselines are committed to git under `tests/visual.spec.ts-snapshots/`.

### Run visual regression tests

```bash
npx playwright test tests/visual.spec.ts
```

### Update baselines after an intentional UI change

```bash
npx playwright test tests/visual.spec.ts --update-snapshots
```

Re-run this whenever you make deliberate changes to the UI that should become the new reference.

## Architecture

### Page Object Model

Each page of the application has a corresponding TypeScript class in `pages/`. The class has two responsibilities:

1. **Locators** — declared as `readonly` properties in the constructor. If a selector changes, you fix it in one place.
2. **Action methods** — methods that combine locators into meaningful steps.

```
BasePage
   └── LoginPage        → login(username, password)
   └── InventoryPage    → addToCartByName(name), sortProducts(option), getCartCount()
   └── CartPage         → checkout(), removeItem(name), getItemCount()
   └── CheckoutPage     → fillCheckoutForm(info), continue(), finish()
```

### Helpers

Standalone functions in `helpers/` for multi-step workflows shared across many tests:

- `loginAs(page, username)` — logs in and waits for the inventory page
- `addToCart(page, productName)` — finds a product card and clicks "Add to cart"
- `fillCheckoutForm(page, data)` — fills all three checkout form fields
- `clearCart(page)` — navigates to cart and removes all items

### Fixtures

`test-fixtures/index.ts` extends Playwright's `test` object so page objects can be injected directly as test parameters:

```typescript
// page objects are auto-instantiated and injected
test('example', async ({ cartPage, checkoutPage }) => {
  await cartPage.goto();
  await cartPage.checkout();
});
```

### Data-driven tests

Test data is stored as JSON in `fixtures/` and imported into specs. `products.spec.ts` uses a `for...of` loop to generate one test per product automatically — adding a product to `products.json` creates a new test without touching the spec file.

## CI/CD

The GitHub Actions workflow (`.github/workflows/playwright.yml`) runs on every push and pull request to `main`/`master`:

1. Checks out the code
2. Sets up Node.js (LTS)
3. Runs `npm ci` (clean install from lockfile)
4. Installs Playwright browsers and system dependencies
5. Runs all tests
6. Uploads the HTML report as an artifact (retained for 30 days)

To view a report from CI: go to the GitHub Actions run → click the `playwright-report` artifact → download and open `index.html`.

## Test Accounts

The following accounts are built into the Swag Labs demo site and stored in `fixtures/users.json`:

| Username | Behaviour |
|---|---|
| `standard_user` | Normal user, all features work |
| `locked_out_user` | Login is blocked with an error |
| `problem_user` | Intentionally broken UI elements |
| `performance_glitch_user` | Simulates slow responses |

Password for all accounts: `secret_sauce`
