# 🧪 Finance Manager - Comprehensive Testing Guide

## Overview

This guide covers all testing aspects of the Finance Manager application:
- Unit Tests
- Integration Tests
- End-to-End (E2E) Tests
- Manual Testing

---

## 📋 Table of Contents

1. [Setup Testing Environment](#setup-testing-environment)
2. [Unit Tests](#unit-tests)
3. [Integration Tests](#integration-tests)
4. [E2E Tests](#e2e-tests)
5. [Manual Testing](#manual-testing)
6. [Test Coverage](#test-coverage)

---

## 🔧 Setup Testing Environment

### Backend Testing Setup

```bash
cd backend

# Install dependencies (if not already)
npm install

# Verify test setup
npm run test -- --version
```

### Required Test Dependencies
All already included in `package.json`:
- `jest` - Test runner
- `@nestjs/testing` - NestJS testing utilities
- `supertest` - HTTP testing
- `ts-jest` - TypeScript support for Jest

---

## 🎯 Unit Tests

Unit tests focus on testing individual components in isolation.

### Running Unit Tests

```bash
cd backend

# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test file
npm run test -- accounts.service.spec.ts
```

### Unit Test Files Created

1. **`src/accounts/accounts.service.spec.ts`**
   - Tests account CRUD operations
   - Tests balance calculations
   - Tests error handling

2. **`src/auth/auth.service.spec.ts`**
   - Tests user registration
   - Tests login authentication
   - Tests password validation
   - Tests JWT token generation

### Example: Running Accounts Service Tests

```bash
npm run test -- accounts.service.spec.ts
```

**Expected Output:**
```
PASS  src/accounts/accounts.service.spec.ts
  AccountsService
    ✓ should be defined (10ms)
    create
      ✓ should create an account successfully (15ms)
    findAll
      ✓ should return all accounts for a user (8ms)
    findOne
      ✓ should return an account if found (7ms)
      ✓ should throw NotFoundException if account not found (6ms)
    update
      ✓ should update an account successfully (12ms)
      ✓ should throw NotFoundException if account not found (5ms)
    remove
      ✓ should delete an account successfully (9ms)
      ✓ should throw NotFoundException if account not found (6ms)
    getBalance
      ✓ should return account balance (11ms)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
```

### Writing Additional Unit Tests

Create new test files following this pattern:

```typescript
// src/[module]/[service].spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';

describe('YourService', () => {
  let service: YourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YourService],
    }).compile();

    service = module.get<YourService>(YourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Add more tests...
});
```

---

## 🔗 Integration Tests

Integration tests verify that different parts of the application work together.

### Running Integration Tests

```bash
cd backend

# Run E2E tests (includes integration tests)
npm run test:e2e

# Run with coverage
npm run test:e2e -- --coverage
```

### Integration Test File

**`test/app.e2e-spec.ts`** - Comprehensive API integration tests

Tests included:
- ✅ Health check
- ✅ Authentication flow (register → login → get profile)
- ✅ Accounts CRUD operations
- ✅ Categories management
- ✅ Transactions handling
- ✅ Dashboard analytics

### Example: Running Integration Tests

```bash
npm run test:e2e
```

**Expected Output:**
```
PASS  test/app.e2e-spec.ts (15.2s)
  Finance Manager API (e2e)
    Health Check
      ✓ / (GET) - should return 404 on root (45ms)
    Authentication Flow
      ✓ /api/auth/register (POST) - should register new user (234ms)
      ✓ /api/auth/register (POST) - should fail with duplicate email (156ms)
      ✓ /api/auth/register (POST) - should fail with invalid email (89ms)
      ✓ /api/auth/login (POST) - should login successfully (287ms)
      ✓ /api/auth/login (POST) - should fail with wrong password (178ms)
      ✓ /api/auth/me (GET) - should get current user (123ms)
      ✓ /api/auth/me (GET) - should fail without token (67ms)
    Accounts CRUD
      ✓ /api/accounts (POST) - should create account (198ms)
      ✓ /api/accounts (GET) - should get all accounts (87ms)
      ✓ /api/accounts/:id (GET) - should get specific account (76ms)
      ✓ /api/accounts/:id (PATCH) - should update account (145ms)
      ✓ /api/accounts/:id (DELETE) - should delete account (112ms)
      ✓ /api/accounts/:id (GET) - should return 404 for deleted account (54ms)
    Categories
      ✓ /api/categories (GET) - should get default categories (98ms)
      ✓ /api/categories (POST) - should create custom category (167ms)
    Transactions
      ✓ /api/transactions (POST) - should create transaction (223ms)
      ✓ /api/transactions (GET) - should get all transactions (89ms)
      ✓ /api/transactions/:id (DELETE) - should delete transaction (134ms)
    Dashboard
      ✓ /api/dashboard/overview (GET) - should get dashboard overview (145ms)
      ✓ /api/dashboard/cash-flow (GET) - should get cash flow data (112ms)

Test Suites: 1 passed, 1 total
Tests:       21 passed, 21 total
Snapshots:   0 total
Time:        15.2s
```

---

## 🌐 End-to-End (E2E) Tests

E2E tests verify the complete user journey through the application.

### Backend E2E Testing

The integration tests (`test/app.e2e-spec.ts`) serve as E2E tests for the API.

### Frontend E2E Testing (Manual for Now)

Since we don't have automated E2E tests for the frontend yet, follow the manual testing guide below.

### Future: Automated Frontend E2E Tests

You can add Playwright or Cypress later:

**Install Playwright:**
```bash
cd frontend
npm install -D @playwright/test
npx playwright install
```

**Example E2E Test:**
```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('user can register and login', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Click register
  await page.click('text=Register');
  
  // Fill form
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'Test123!@#');
  await page.fill('input[name="name"]', 'Test User');
  
  // Submit
  await page.click('button[type="submit"]');
  
  // Verify redirect to dashboard
  await expect(page).toHaveURL('/dashboard');
});
```

---

## 👤 Manual Testing

### Prerequisites
- Backend deployed to Render
- Frontend deployed to Vercel
- Both connected via environment variables

### Test Scenarios

#### 1. Authentication Flow

**Register New User:**
1. Go to frontend URL
2. Click "Register"
3. Fill form:
   - Email: `test@example.com`
   - Password: `Test123!@#`
   - Name: `Test User`
4. Click "Register"
5. ✅ Should redirect to dashboard
6. ✅ Should see welcome message

**Login:**
1. Logout (if logged in)
2. Click "Login"
3. Enter credentials
4. Click "Login"
5. ✅ Should redirect to dashboard
6. ✅ Should load user data

**Test Invalid Cases:**
- ❌ Register with existing email → Should show error
- ❌ Login with wrong password → Should show error
- ❌ Access dashboard without login → Should redirect to login

#### 2. Account Management

**Create Account:**
1. Navigate to "Accounts" page
2. Click "Add Account"
3. Fill form:
   - Name: `My Checking`
   - Type: `Checking`
   - Balance: `5000`
   - Currency: `USD`
4. Click "Save"
5. ✅ Should see new account in list
6. ✅ Balance should display correctly

**Update Account:**
1. Click account
2. Click "Edit"
3. Change name to `My Primary Checking`
4. Click "Save"
5. ✅ Should show updated name

**Delete Account:**
1. Click account
2. Click "Delete"
3. Confirm deletion
4. ✅ Account should be removed from list

#### 3. Transaction Management

**Create Income Transaction:**
1. Go to "Transactions"
2. Click "Add Transaction"
3. Fill form:
   - Type: `Income`
   - Amount: `1000`
   - Category: `Salary`
   - Account: `My Checking`
   - Date: Today
   - Description: `Monthly salary`
4. Click "Save"
5. ✅ Transaction appears in list
6. ✅ Account balance increases

**Create Expense Transaction:**
1. Click "Add Transaction"
2. Fill form:
   - Type: `Expense`
   - Amount: `50`
   - Category: `Food`
   - Account: `My Checking`
   - Date: Today
   - Description: `Groceries`
3. Click "Save"
4. ✅ Transaction appears in list
5. ✅ Account balance decreases

**Filter Transactions:**
1. Use date range picker
2. Select last 30 days
3. ✅ Should show filtered transactions
4. Use category filter
5. Select "Food"
6. ✅ Should show only food transactions

#### 4. Budget Management

**Create Budget:**
1. Go to "Budgets"
2. Click "Create Budget"
3. Fill form:
   - Category: `Food`
   - Amount: `500`
   - Period: `Monthly`
4. Click "Save"
5. ✅ Budget appears with progress bar
6. ✅ Progress shows based on transactions

**Budget Alert:**
1. Add expense transactions totaling > 80% of budget
2. ✅ Should show warning color
3. Add transactions > 100% of budget
4. ✅ Should show danger color/alert

#### 5. Financial Goals

**Create Goal:**
1. Go to "Goals"
2. Click "Create Goal"
3. Fill form:
   - Name: `Emergency Fund`
   - Target Amount: `10000`
   - Current Amount: `2000`
   - Deadline: 6 months from now
4. Click "Save"
5. ✅ Goal appears with progress indicator
6. ✅ Shows percentage complete (20%)

**Contribute to Goal:**
1. Click goal
2. Click "Add Contribution"
3. Enter amount: `500`
4. Click "Save"
5. ✅ Current amount increases
6. ✅ Progress bar updates

#### 6. Dashboard Analytics

**Verify Dashboard:**
1. Go to "Dashboard"
2. ✅ Total Balance shows correctly
3. ✅ Income/Expense cards show month data
4. ✅ Cash flow chart displays
5. ✅ Spending chart displays
6. ✅ Budget progress shows
7. ✅ Goal progress shows
8. ✅ Recent transactions list
9. ✅ Financial health score displays

#### 7. Reports

**Generate Income/Expense Report:**
1. Go to "Reports"
2. Select date range (last 3 months)
3. Click "Generate Report"
4. ✅ Chart displays income vs expense
5. ✅ Summary shows totals
6. Click "Export CSV"
7. ✅ File downloads

**Category Breakdown:**
1. Select "Category Report"
2. Choose "Expense"
3. Select date range
4. ✅ Pie chart shows spending by category
5. ✅ Top categories listed

#### 8. Settings

**Update Profile:**
1. Go to "Settings"
2. Update name
3. Click "Save"
4. ✅ Name updated throughout app

**Change Preferences:**
1. Select currency: `EUR`
2. Select theme: `Dark`
3. Click "Save"
4. ✅ Currency symbols update
5. ✅ Theme changes (if implemented)

---

## 📊 Test Coverage

### View Coverage Report

```bash
cd backend

# Generate coverage report
npm run test:cov

# Open coverage report in browser
# coverage/lcov-report/index.html
```

### Coverage Goals

- **Statements:** > 80%
- **Branches:** > 75%
- **Functions:** > 80%
- **Lines:** > 80%

### Current Coverage

Run `npm run test:cov` to see current coverage.

---

## ✅ Testing Checklist

### Before Deployment
- [ ] All unit tests pass
- [ ] All integration tests pass
- [ ] Code coverage > 80%
- [ ] No linting errors
- [ ] Environment variables configured

### After Deployment
- [ ] Health check endpoint responds
- [ ] Can register new user
- [ ] Can login
- [ ] Can create account
- [ ] Can create transaction
- [ ] Dashboard loads
- [ ] No CORS errors
- [ ] No console errors

### Manual Testing
- [ ] All CRUD operations work
- [ ] Filters and search work
- [ ] Charts display correctly
- [ ] Responsive on mobile
- [ ] Forms validate correctly
- [ ] Error messages display
- [ ] Loading states show
- [ ] Success notifications appear

---

## 🐛 Common Issues & Solutions

### Issue: Tests Fail Locally

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Jest cache
npm run test -- --clearCache

# Run tests again
npm run test
```

### Issue: Database Connection in Tests

**Solution:**
Tests use in-memory or mock database. Check `test/jest-e2e.json` configuration.

### Issue: Timeout Errors

**Solution:**
```bash
# Increase timeout
npm run test -- --testTimeout=10000
```

---

## 🎯 Next Steps

1. **Run All Tests:**
   ```bash
   cd backend
   npm run test
   npm run test:e2e
   ```

2. **Fix Any Failures**

3. **Deploy to Render** (if tests pass)

4. **Run Manual Tests** on deployed app

5. **Add More Tests** as needed:
   - Budgets service unit tests
   - Goals service unit tests
   - Transactions service unit tests
   - Dashboard service unit tests

---

## 📚 Resources

- [Jest Documentation](https://jestjs.io/)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Supertest](https://github.com/visionmedia/supertest)
- [Playwright](https://playwright.dev/)

---

*Testing Guide - Last Updated: October 9, 2025*

