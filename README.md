
# Playwright API Automation Framework

[![Playwright API Tests](https://github.com/MilosSreckovic/qa-automation-exercise-typeScript-playwright/actions/workflows/playwright-api.yml/badge.svg)](https://github.com/MilosSreckovic/qa-automation-exercise-typeScript-playwright/actions/workflows/playwright-api.yml)

A REST API test automation framework built with **Playwright and TypeScript**, using the Automation Exercise demo application.

The project demonstrates API testing, reusable framework architecture, positive and negative scenarios, dynamic test data, account lifecycle management, error handling, and CI integration.

**Application under test:** https://automationexercise.com

## Technology Stack

| Technology | Purpose |
|---|---|
| Playwright | REST API test automation |
| TypeScript | Strongly typed test implementation |
| Node.js | JavaScript runtime |
| npm | Dependency management |
| GitHub Actions | Continuous integration |
| Playwright HTML Reporter | Test execution reporting |
| Git & GitHub | Version control |

The framework uses Playwright's `APIRequestContext` and does not require a browser for API test execution.

## Test Coverage

The suite currently contains **11 API tests**.

### Authentication API — 7 Tests

- Verify login with missing credentials
- Create a new user account
- Verify login with valid credentials
- Delete an existing user account
- Verify login with non-existing credentials
- Retrieve user details with non-existing email
- Retrieve user details with existing email

### Products API — 2 Tests

- Retrieve and validate the product list
- Verify unsupported POST method handling

### Search API — 2 Tests

- Search products using a valid search term
- Verify error handling when the required search parameter is missing

## Framework Architecture

### API Client

The `ApiClient` class centralizes HTTP requests and provides reusable methods for API operations.

This separates request implementation from test assertions and reduces duplicated code.

### Centralized Endpoints

API paths and the base URL are maintained in `config/api-endpoints.ts`.

This improves maintainability and simplifies endpoint updates.

### TypeScript Validation

Strict TypeScript configuration is used to detect type-related issues before test execution.

### Dynamic Test Data

Unique email addresses are generated for test accounts to reduce conflicts between executions.

### Test Independence

Tests are designed to run independently without relying on execution order.

### Account Lifecycle Management

Reusable helper functions support account creation and deletion.

Tests that create accounts use cleanup logic to remove temporary data.

When account creation or deletion returns HTTP 503, the framework can check the account state before determining the outcome.

Cleanup remains dependent on external API availability.

### HTTP 503 Handling

The Automation Exercise API may occasionally return HTTP 503 because of server overload.

A limited retry mechanism is implemented for selected read-only operations.

Account creation and deletion are handled separately to avoid blindly repeating operations that modify server state.

### API Response Validation

Tests validate:

- HTTP status codes
- Application-specific response codes
- Expected response messages
- Response data types
- Required product attributes
- User account information
- Positive and negative API behavior

## Project Structure

```text
QA-Automation-Exercise/
|
|-- .github/
|   |-- workflows/
|       |-- playwright-api.yml
|
|-- config/
|   |-- api-endpoints.ts
|
|-- helpers/
|   |-- api-client.ts
|
|-- tests/
|   |-- api/
|       |-- authentication-api.spec.ts
|       |-- products-api.spec.ts
|       |-- search-api.spec.ts
|
|-- playwright.config.ts
|-- tsconfig.json
|-- package.json
|-- package-lock.json
|-- README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/MilosSreckovic/qa-automation-exercise-typeScript-playwright.git
```

Navigate to the project:

```bash
cd qa-automation-exercise-typeScript-playwright
```

Install dependencies:

```bash
npm ci
```

## Running Tests

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Run all API tests:

```bash
npx playwright test tests/api --workers=1
```

Run authentication tests:

```bash
npx playwright test tests/api/authentication-api.spec.ts --workers=1
```

Run products tests:

```bash
npx playwright test tests/api/products-api.spec.ts --workers=1
```

Run search tests:

```bash
npx playwright test tests/api/search-api.spec.ts --workers=1
```

Run a specific test:

```bash
npx playwright test --grep "POST verify login with valid credentials"
```

Open the HTML report:

```bash
npx playwright show-report
```

## Continuous Integration

GitHub Actions executes the API automation suite on:

- Push to `main`
- Pull requests targeting `main`
- Manual workflow execution

The CI pipeline performs:

1. Repository checkout
2. Node.js setup
3. Dependency installation using `npm ci`
4. TypeScript type checking
5. Playwright API test execution with one worker
6. HTML test report artifact upload

Test reports are retained for seven days.

## Test Strategy

The testing approach prioritizes:

1. Critical API functionality
2. Authentication and account management
3. Product data validation
4. Search functionality
5. Negative scenarios and error handling
6. Test independence and maintainability
7. Reliable cleanup and external service error handling

Tests validate observable API behavior rather than internal implementation details.

## Future Improvements

- Introduce typed API response interfaces
- Add JSON schema validation
- Expand negative API coverage
- Improve test data management
- Strengthen cleanup recovery for ambiguous API failures
- Introduce environment-based configuration
- Extend API coverage to additional endpoints

## Author

**Milos Sreckovic**

Senior QA Automation Engineer

6+ years of experience in test automation, API testing, performance engineering, and software quality assurance.

**GitHub:** https://github.com/MilosSreckovic

**Portfolio:** https://milossreckovic.github.io/
