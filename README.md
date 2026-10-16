# DemoBlaze Playwright Suite

End-to-end browser tests for the [DemoBlaze Product Store](https://www.demoblaze.com/), written in TypeScript with Playwright Test and the Page Object Model (POM).

## Test coverage

- Catalog category filtering and exclusion of products from other categories.
- Product details, add-to-cart behavior, and invalid product ID handling.
- Cart contents, total price, item removal, and empty-cart state.
- Successful and unsuccessful login scenarios.
- Guest and logged-in checkout, blank required fields, and malformed card behavior.
- Purchase confirmation screenshots attached to successful checkout test results.

The DemoBlaze demo site currently checks only whether the name and card fields are blank; it accepts malformed non-empty card values. The malformed-card test uses `test.fail()` to document this known site limitation.

## Project file guide

### Root files

| File | Description |
| --- | --- |
| `.gitignore` | Excludes dependencies, generated Playwright reports/results, downloaded browsers, local login credentials, and the local staging folder. |
| `README.md` | Project overview, setup instructions, test coverage, and this file guide. |
| `package.json` | Project metadata, npm scripts, and development dependencies. |
| `package-lock.json` | Locks dependency versions for repeatable npm installs. |
| `playwright.config.ts` | Playwright test discovery, browser settings, base URL, retries, worker count, reporters, and failure artifacts. |
| `tsconfig.json` | TypeScript compiler options and source/test file inclusion. |
| `purchase-confirmation.png` | Sample purchase confirmation screenshot kept with the project. |

### Page objects and types

| File | Description |
| --- | --- |
| `src/pages/catalog-page.ts` | Opens the store, filters product categories, and opens a product. |
| `src/pages/product-page.ts` | Reads product details, adds a product to the cart, and handles the site's alert. |
| `src/pages/cart-page.ts` | Opens the cart and exposes cart rows, totals, delete controls, and checkout. |
| `src/pages/login-page.ts` | Opens the login form, submits credentials, and checks login state. |
| `src/pages/checkout-page.ts` | Enters order details, submits checkout, and checks validation or confirmation. |
| `src/types/purchase-details.ts` | Type definition for checkout data. |

### Test data

| File | Description |
| --- | --- |
| `test-data/purchase-details.json` | Dummy customer and card data for checkout tests; it is for the demo site only. |
| `test-data/login-credentials.example.json` | Safe template for the demo account login data. The password is a placeholder and must be replaced locally. |
| `test-data/login-credentials.json` | Local demo-account credentials used by login and logged-in checkout tests. This file is intentionally ignored by Git; never commit its password or any real/private credentials. |

### Tests and helpers

| File | Description |
| --- | --- |
| `tests/support.ts` | Re-exports shared cart setup and product constants for tests. |
| `tests/helpers/cart-setup.ts` | Reusable workflow that opens a product, adds it to the cart, and opens the cart. |
| `tests/catalog/catalog.spec.ts` | Catalog category filtering and cross-category exclusion tests. |
| `tests/product/product.spec.ts` | Product details, add-to-cart, and invalid product ID tests. |
| `tests/cart/cart.spec.ts` | Cart contents and total, deletion, and empty-cart tests. |
| `tests/login/login.spec.ts` | Valid login and unknown-username rejection tests. |
| `tests/checkout/checkout.spec.ts` | Guest and logged-in checkout, blank-field validation, and malformed-card tests. |

## Setup and run

Requirements: Node.js 18 or newer and npm.

```bash
npm install
npx playwright install chromium
```

Copy `test-data/login-credentials.example.json` to `test-data/login-credentials.json` and replace the password placeholder with the password for your DemoBlaze demo account:

```json
{
  "userId": "shalinishirolkar",
  "password": "replace-with-your-demo-password"
}
```

Do not commit `test-data/login-credentials.json`. It is excluded by `.gitignore`.

Run the tests and TypeScript check:

```bash
npm test
npx tsc --noEmit
```

Additional commands:

```bash
npm run test:headed
npm run test:ui
npm run report
```

## Reliability and artifacts

Each test uses a fresh browser context. Playwright uses role/text locators where available, locator assertions, and event-based synchronization; the tests do not use fixed sleeps. The configuration runs with two workers and retries failed tests three times. Traces, screenshots, and videos are retained for failures, and an HTML report can be opened with `npm run report`.

The suite exercises a public demo service, so results can be affected by the site's availability, loading behavior, and shared backend state.
