# DemoBlaze Playwright suite

A compact end-to-end suite for the [DemoBlaze Product Store](https://www.demoblaze.com/), implemented with Playwright Test and TypeScript using Page Object Model (POM) modules.

## Coverage

- Catalog category filtering and negative coverage that laptops exclude a phone.
- Product details, add-to-cart behavior, and an invalid product ID boundary check.
- Cart line item and calculated total, item removal, and the empty-cart state.
- Successful login using credentials in `test-data/login-credentials.json`, plus an unknown-username rejection with the correct password.
- Successful guest and logged-in customer checkout using dummy order details from `test-data/purchase-details.json`.
- Negative checkout coverage for blank required fields, plus an expected-failure test for malformed card numbers.
- Purchase confirmation screenshots are attached to the Playwright report for guest and logged-in checkout.

DemoBlaze's purchase code checks only whether the name and card fields are blank; it accepts malformed, non-empty card values. The malformed-card test is marked with `test.fail()` to document that known limitation without treating the current behavior as an unexpected regression.

A DemoBlaze demo account was created for the successful login case. Its credentials are stored in `test-data/login-credentials.json`, which is excluded by `.gitignore`. Dummy checkout information, including the test card number, is stored in `test-data/purchase-details.json`. These values are for the public demo site only; do not use production payment details.

Each test gets a fresh browser context. The suite uses accessible roles and text where available, and stable IDs for controls that have no accessible labels. Native JavaScript alerts are explicitly awaited and asserted. Locators have descriptive names and are created inside the Page Object methods that use them. Playwright's locator assertions and synchronization are used throughout; there are no fixed sleeps.

## POM modules

- `src/pages/catalog-page.ts`: open the store, filter categories, and open a product.
- `src/pages/product-page.ts`: verify product details, add the current product to the cart, and handle the site alert.
- `src/pages/cart-page.ts`: open the cart and access cart rows and totals.
- `src/pages/login-page.ts`: open the login dialog, submit credentials, and assert login state.
- `src/pages/checkout-page.ts`: enter checkout details, submit an order, and assert confirmation.
- `tests/helpers/cart-setup.ts`: reusable test setup to add a product and navigate to the cart.
- `tests/catalog/`, `tests/product/`, `tests/cart/`, `tests/login/`, `tests/checkout/`: scenario specs grouped by feature.

## Requirements

- Node.js 18 or newer
- npm

## Setup and run

```bash
npm install
npx playwright install chromium
npm test
```

For headed runs or interactive debugging:

```bash
npm run test:headed
npm run test:ui
```

Open the HTML report after a run with:

```bash
npm run report
```

## Reliability choices

`playwright.config.ts` sets `retries: 3`, so each failed test is retried three times before Playwright reports the final result. Failure traces, screenshots, and videos are retained to help diagnose intermittent failures. Tests run independently and in parallel by default. On CI, the worker count is capped at two and exclusive tests are rejected.

The login tests use the dedicated demo account in the local credentials JSON; each test starts in a fresh browser context. The store is a public demo service, so availability and backend state depend on the live site.
