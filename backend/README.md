# Finance Manager API - Backend Documentation

> A comprehensive Personal Finance Management (PFM) system with AI-based analytics, automated recurring transactions, intelligent notifications, and advanced reporting capabilities.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-red)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3-orange)](https://typeorm.io/)

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
  - [Authentication](#1-authentication-endpoints)
  - [Users](#2-users-endpoints)
  - [User Preferences](#3-user-preferences-endpoints)
  - [Accounts](#4-accounts-endpoints)
  - [Categories](#5-categories-endpoints)
  - [Transactions](#6-transactions-endpoints)
  - [Recurring Transactions](#7-recurring-transactions-endpoints)
  - [Budgets](#8-budgets-endpoints)
  - [Goals](#9-goals-endpoints)
  - [Dashboard](#10-dashboard-endpoints)
  - [Reports](#11-reports-endpoints)
  - [Search](#12-search-endpoints)
  - [Notifications](#13-notifications-endpoints)
- [Database Schema](#-database-schema)
- [Automated Tasks](#-automated-tasks)
- [Development](#-development)

---

## 🎯 Features

### Core Functionality
- **Multi-Account Management** - Track checking, savings, credit cards, cash, investments, and loans
- **Smart Categorization** - 23 pre-loaded categories (15 expense, 8 income) with custom category support
- **Transaction Management** - Income, expenses, and inter-account transfers with tagging and attachments
- **Budget Tracking** - Weekly, monthly, quarterly, and yearly budgets with real-time progress
- **Savings Goals** - Track financial goals with milestones and progress indicators

### Advanced Features
- **Recurring Transactions** - Automated transaction creation (daily, weekly, monthly, etc.)
- **Intelligent Notifications** - Budget alerts, goal milestones, low balance warnings
- **Financial Health Score** - AI-based scoring system (0-100) with actionable insights
- **Advanced Analytics** - Cash flow analysis, spending patterns, income statements
- **Comprehensive Reports** - Balance sheet, income statement, budget reports, monthly comparisons
- **Global Search** - Multi-filter search across all entities with quick statistics
- **User Preferences** - Customizable currency, locale, notifications, and UI settings

### Automation
- **Scheduled Jobs** - Cron-based automation for recurring transactions and alerts
- **Auto-Notifications** - Smart alerts triggered by financial events
- **Balance Synchronization** - Automatic account balance updates on transactions

---

## 🛠 Tech Stack

**Framework & Runtime:**
- Node.js 20+ with TypeScript 5.4
- NestJS 10.0 (Modular architecture)
- Express (HTTP server)

**Database & ORM:**
- PostgreSQL 15+
- TypeORM 0.3 (Migrations, entities, query builder)

**Authentication & Security:**
- JWT (JSON Web Tokens)
- Passport.js
- bcryptjs (Password hashing)

**Validation & Serialization:**
- class-validator
- class-transformer

**Task Scheduling:**
- @nestjs/schedule (Cron jobs)

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 20.x
PostgreSQL >= 15.x
npm >= 10.x
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/leandre000/Finance-Manager-AiBased.git
cd Finance-Manager-AiBased/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file:

```env
# Server
NODE_ENV=development
PORT=3000

# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=fima
POSTGRES_PASSWORD=secret
POSTGRES_DB=fima

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=7d

# Optional: CORS
CORS_ORIGIN=http://localhost:5173
```

4. **Start PostgreSQL**

```bash
# Using Docker
docker run --name fima-postgres \
  -e POSTGRES_USER=fima \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=fima \
  -p 5432:5432 \
  -d postgres:15-alpine

# Or use docker-compose
docker-compose up -d
```

5. **Run migrations**

```bash
npm run migration:run
```

6. **Start the development server**

```bash
npm run start:dev
```

Server will be running at: **http://localhost:3000**

---

## 🏗 Architecture

### Module Structure

```
src/
├── auth/                    # Authentication & authorization
├── users/                   # User management
├── user-preferences/        # User settings & customization
├── accounts/                # Financial accounts
├── categories/              # Transaction categories
├── transactions/            # Financial transactions
├── recurring-transactions/  # Automated recurring transactions
├── budgets/                 # Budget management
├── goals/                   # Savings goals
├── notifications/           # Alert & notification system
├── dashboard/               # Analytics & insights
├── reports/                 # Financial reports
├── search/                  # Advanced search engine
├── scheduler/               # Cron jobs & automation
├── database/                # Database configuration
├── config/                  # App configuration
├── health/                  # Health check endpoint
└── migrations/              # Database migrations
```

### Design Patterns

- **Dependency Injection** - NestJS native DI container
- **Repository Pattern** - TypeORM repositories for data access
- **DTO Pattern** - Data Transfer Objects for validation
- **Service Layer** - Business logic separation
- **Guard Pattern** - JWT authentication guards
- **Cron Pattern** - Scheduled task execution

---

## 📚 API Documentation

**Base URL:** `http://localhost:3000`

**Authentication:** All endpoints (except `/auth/*` and `/health`) require JWT Bearer token.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

### 1. Authentication Endpoints

#### 1.1 Register User

**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "password": "SecurePass123!"
}
```

**Response:** `201 Created`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Validation Rules:**
- `email`: Valid email format, unique
- `fullName`: Minimum 2 characters
- `password`: Minimum 8 characters

---

#### 1.2 Login User

**POST** `/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "isActive": true
  }
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

---

### 2. Users Endpoints

#### 2.1 Get Current User Profile

**GET** `/auth/profile`

Retrieve authenticated user's profile.

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 3. User Preferences Endpoints

#### 3.1 Get User Preferences

**GET** `/user-preferences`

Retrieve user preferences (auto-creates with defaults if not exists).

**Response:** `200 OK`
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "defaultCurrency": "USD",
  "locale": "en-US",
  "timezone": "America/New_York",
  "dateFormat": "YYYY-MM-DD",
  "enableNotifications": true,
  "emailNotifications": true,
  "pushNotifications": false,
  "budgetAlerts": true,
  "goalMilestones": true,
  "lowBalanceAlerts": true,
  "lowBalanceThreshold": 100,
  "recurringReminders": true,
  "recurringReminderDays": 3,
  "monthlyReports": false,
  "weeklyDigest": false,
  "theme": "light",
  "dashboardWidgets": ["balance", "cashflow", "budgets", "goals"],
  "hiddenCategories": [],
  "customSettings": {},
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

#### 3.2 Update User Preferences

**PATCH** `/user-preferences`

Update user preferences (partial update).

**Request Body:**
```json
{
  "defaultCurrency": "EUR",
  "theme": "dark",
  "lowBalanceThreshold": 50,
  "budgetAlerts": true,
  "emailNotifications": false
}
```

**Response:** `200 OK` (Updated preferences object)

---

#### 3.3 Reset Preferences to Defaults

**POST** `/user-preferences/reset`

Reset all preferences to default values.

**Response:** `200 OK` (Default preferences object)

---

#### 3.4 Update Dashboard Widgets

**PATCH** `/user-preferences/dashboard-widgets`

Customize dashboard widget layout.

**Request Body:**
```json
{
  "widgets": ["balance", "recent-transactions", "budgets", "spending-chart"]
}
```

**Response:** `200 OK`

---

#### 3.5 Hide Category

**PATCH** `/user-preferences/hide-category/:categoryId`

Hide a category from the user's view.

**Parameters:**
- `categoryId` (path): UUID of category to hide

**Response:** `200 OK`

---

#### 3.6 Unhide Category

**PATCH** `/user-preferences/unhide-category/:categoryId`

Show a previously hidden category.

**Parameters:**
- `categoryId` (path): UUID of category to unhide

**Response:** `200 OK`

---

### 4. Accounts Endpoints

#### 4.1 Create Account

**POST** `/accounts`

Create a new financial account.

**Request Body:**
```json
{
  "name": "Chase Checking",
  "type": "checking",
  "balance": 5000.00,
  "currency": "USD",
  "color": "#0066CC",
  "icon": "💳",
  "description": "Primary checking account",
  "isActive": true,
  "includeInTotal": true
}
```

**Account Types:**
- `checking`, `savings`, `credit_card`, `cash`, `investment`, `loan`, `other`

**Response:** `201 Created`
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "name": "Chase Checking",
  "type": "checking",
  "balance": "5000.00",
  "creditLimit": null,
  "currency": "USD",
  "color": "#0066CC",
  "icon": "💳",
  "description": "Primary checking account",
  "isActive": true,
  "includeInTotal": true,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T11:00:00.000Z",
  "updatedAt": "2024-01-15T11:00:00.000Z"
}
```

---

#### 4.2 Get All Accounts

**GET** `/accounts`

Retrieve all user accounts.

**Response:** `200 OK`
```json
[
  {
    "id": "770e8400-e29b-41d4-a716-446655440000",
    "name": "Chase Checking",
    "type": "checking",
    "balance": "5000.00",
    "currency": "USD",
    "color": "#0066CC",
    "icon": "💳",
    "isActive": true,
    "includeInTotal": true,
    "createdAt": "2024-01-15T11:00:00.000Z"
  },
  {
    "id": "880e8400-e29b-41d4-a716-446655440000",
    "name": "Savings Account",
    "type": "savings",
    "balance": "15000.00",
    "currency": "USD",
    "color": "#00AA44",
    "icon": "🏦",
    "isActive": true,
    "includeInTotal": true,
    "createdAt": "2024-01-15T11:05:00.000Z"
  }
]
```

---

#### 4.3 Get Total Balance

**GET** `/accounts/total-balance`

Calculate total balance across all active accounts.

**Response:** `200 OK`
```json
{
  "totalBalance": 20000.00
}
```

---

#### 4.4 Get Account by ID

**GET** `/accounts/:id`

Retrieve specific account details.

**Response:** `200 OK` (Single account object)

---

#### 4.5 Update Account

**PATCH** `/accounts/:id`

Update account information.

**Request Body:**
```json
{
  "name": "Chase Checking - Main",
  "balance": 5500.00,
  "color": "#0077DD"
}
```

**Response:** `200 OK` (Updated account object)

---

#### 4.6 Delete Account

**DELETE** `/accounts/:id`

Delete an account (cascades to transactions).

**Response:** `200 OK`

**Warning:** This will delete all associated transactions!

---

### 5. Categories Endpoints

#### 5.1 Create Category

**POST** `/categories`

Create a custom category.

**Request Body:**
```json
{
  "name": "Gym & Fitness",
  "type": "expense",
  "color": "#FF5722",
  "icon": "💪",
  "description": "Gym memberships and fitness equipment"
}
```

**Category Types:**
- `income`, `expense`

**Response:** `201 Created`
```json
{
  "id": "990e8400-e29b-41d4-a716-446655440000",
  "name": "Gym & Fitness",
  "type": "expense",
  "color": "#FF5722",
  "icon": "💪",
  "description": "Gym memberships and fitness equipment",
  "isSystem": false,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T12:00:00.000Z"
}
```

---

#### 5.2 Get All Categories

**GET** `/categories`

**Query Parameters:**
- `type` (optional): Filter by `income` or `expense`

**Response:** `200 OK`
```json
[
  {
    "id": "aa0e8400-e29b-41d4-a716-446655440000",
    "name": "Food & Dining",
    "type": "expense",
    "color": "#FF6B6B",
    "icon": "🍔",
    "description": "Restaurants, groceries, and food delivery",
    "isSystem": true,
    "userId": null
  },
  {
    "id": "990e8400-e29b-41d4-a716-446655440000",
    "name": "Gym & Fitness",
    "type": "expense",
    "color": "#FF5722",
    "icon": "💪",
    "description": "Gym memberships and fitness equipment",
    "isSystem": false,
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
]
```

**Note:** System categories (`isSystem: true`) are shared across all users and cannot be modified.

---

#### 5.3 Get Category by ID

**GET** `/categories/:id`

**Response:** `200 OK` (Single category object)

---

#### 5.4 Update Category

**PATCH** `/categories/:id`

Update custom category (cannot update system categories).

**Request Body:**
```json
{
  "name": "Fitness & Wellness",
  "color": "#E91E63"
}
```

**Response:** `200 OK` (Updated category object)

---

#### 5.5 Delete Category

**DELETE** `/categories/:id`

Delete custom category (cannot delete system categories).

**Response:** `200 OK`

---

### 6. Transactions Endpoints

#### 6.1 Create Transaction

**POST** `/transactions`

Create a new transaction (income, expense, or transfer).

**Request Body (Expense):**
```json
{
  "type": "expense",
  "amount": 45.99,
  "date": "2024-01-15",
  "description": "Grocery shopping at Whole Foods",
  "notes": "Weekly groceries",
  "payee": "Whole Foods Market",
  "tags": ["groceries", "weekly"],
  "accountId": "770e8400-e29b-41d4-a716-446655440000",
  "categoryId": "aa0e8400-e29b-41d4-a716-446655440000"
}
```

**Request Body (Transfer):**
```json
{
  "type": "transfer",
  "amount": 1000.00,
  "date": "2024-01-15",
  "description": "Transfer to savings",
  "accountId": "770e8400-e29b-41d4-a716-446655440000",
  "toAccountId": "880e8400-e29b-41d4-a716-446655440000"
}
```

**Response:** `201 Created`
```json
{
  "id": "bb0e8400-e29b-41d4-a716-446655440000",
  "type": "expense",
  "amount": "45.99",
  "date": "2024-01-15",
  "description": "Grocery shopping at Whole Foods",
  "notes": "Weekly groceries",
  "payee": "Whole Foods Market",
  "tags": ["groceries", "weekly"],
  "attachments": null,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "accountId": "770e8400-e29b-41d4-a716-446655440000",
  "categoryId": "aa0e8400-e29b-41d4-a716-446655440000",
  "toAccountId": null,
  "isRecurring": false,
  "recurringFrequency": null,
  "parentTransactionId": null,
  "createdAt": "2024-01-15T14:30:00.000Z",
  "updatedAt": "2024-01-15T14:30:00.000Z"
}
```

**Note:** Account balances are automatically updated when transactions are created.

---

#### 6.2 Get All Transactions

**GET** `/transactions`

**Query Parameters:**
- `accountId` (optional): Filter by account
- `categoryId` (optional): Filter by category
- `type` (optional): Filter by type (`income`, `expense`, `transfer`)
- `startDate` (optional): Filter by start date (YYYY-MM-DD)
- `endDate` (optional): Filter by end date (YYYY-MM-DD)

**Example:** `/transactions?type=expense&startDate=2024-01-01&endDate=2024-01-31`

**Response:** `200 OK`
```json
[
  {
    "id": "bb0e8400-e29b-41d4-a716-446655440000",
    "type": "expense",
    "amount": "45.99",
    "date": "2024-01-15",
    "description": "Grocery shopping at Whole Foods",
    "payee": "Whole Foods Market",
    "tags": ["groceries", "weekly"],
    "account": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "name": "Chase Checking"
    },
    "category": {
      "id": "aa0e8400-e29b-41d4-a716-446655440000",
      "name": "Food & Dining",
      "icon": "🍔",
      "color": "#FF6B6B"
    },
    "createdAt": "2024-01-15T14:30:00.000Z"
  }
]
```

---

#### 6.3 Get Transaction Statistics

**GET** `/transactions/statistics`

**Query Parameters:**
- `startDate` (required): Start date (YYYY-MM-DD)
- `endDate` (required): End date (YYYY-MM-DD)

**Example:** `/transactions/statistics?startDate=2024-01-01&endDate=2024-01-31`

**Response:** `200 OK`
```json
{
  "income": 5000.00,
  "expenses": 2350.75,
  "transfers": 1000.00,
  "netIncome": 2649.25,
  "totalTransactions": 47
}
```

---

#### 6.4 Get Transaction by ID

**GET** `/transactions/:id`

**Response:** `200 OK` (Single transaction with relations)

---

#### 6.5 Update Transaction

**PATCH** `/transactions/:id`

Update transaction details.

**Request Body:**
```json
{
  "amount": 48.50,
  "description": "Grocery shopping at Whole Foods - Updated",
  "tags": ["groceries", "weekly", "organic"]
}
```

**Response:** `200 OK` (Updated transaction)

**Note:** Account balances are automatically recalculated.

---

#### 6.6 Delete Transaction

**DELETE** `/transactions/:id`

Delete a transaction.

**Response:** `200 OK`

**Note:** Account balances are automatically adjusted.

---

### 7. Recurring Transactions Endpoints

#### 7.1 Create Recurring Transaction

**POST** `/recurring-transactions`

Set up automated recurring transaction.

**Request Body:**
```json
{
  "name": "Monthly Rent",
  "type": "expense",
  "amount": 1500.00,
  "frequency": "monthly",
  "startDate": "2024-02-01",
  "endDate": null,
  "description": "Monthly apartment rent",
  "payee": "Property Management Inc",
  "accountId": "770e8400-e29b-41d4-a716-446655440000",
  "categoryId": "cc0e8400-e29b-41d4-a716-446655440000",
  "autoCreate": true,
  "notifyBeforeCreation": true,
  "notifyDaysBefore": 3
}
```

**Frequency Options:**
- `daily`, `weekly`, `biweekly`, `monthly`, `quarterly`, `yearly`

**Response:** `201 Created`
```json
{
  "id": "dd0e8400-e29b-41d4-a716-446655440000",
  "name": "Monthly Rent",
  "type": "expense",
  "amount": "1500.00",
  "frequency": "monthly",
  "startDate": "2024-02-01",
  "endDate": null,
  "nextOccurrence": "2024-02-01",
  "lastProcessed": null,
  "status": "active",
  "description": "Monthly apartment rent",
  "payee": "Property Management Inc",
  "occurrenceCount": 0,
  "maxOccurrences": null,
  "autoCreate": true,
  "notifyBeforeCreation": true,
  "notifyDaysBefore": 3,
  "accountId": "770e8400-e29b-41d4-a716-446655440000",
  "categoryId": "cc0e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T15:00:00.000Z"
}
```

---

#### 7.2 Get All Recurring Transactions

**GET** `/recurring-transactions`

**Query Parameters:**
- `status` (optional): Filter by status (`active`, `paused`, `completed`, `cancelled`)

**Response:** `200 OK` (Array of recurring transactions)

---

#### 7.3 Get Upcoming Recurring Transactions

**GET** `/recurring-transactions/upcoming`

**Query Parameters:**
- `days` (optional): Number of days to look ahead (default: 30)

**Example:** `/recurring-transactions/upcoming?days=7`

**Response:** `200 OK`
```json
[
  {
    "id": "dd0e8400-e29b-41d4-a716-446655440000",
    "name": "Monthly Rent",
    "amount": "1500.00",
    "nextOccurrence": "2024-02-01",
    "frequency": "monthly",
    "account": {
      "name": "Chase Checking"
    }
  }
]
```

---

#### 7.4 Pause Recurring Transaction

**PATCH** `/recurring-transactions/:id/pause`

Temporarily pause automatic processing.

**Response:** `200 OK` (Updated recurring transaction with `status: "paused"`)

---

#### 7.5 Resume Recurring Transaction

**PATCH** `/recurring-transactions/:id/resume`

Resume automatic processing.

**Response:** `200 OK` (Updated recurring transaction with `status: "active"`)

---

#### 7.6 Cancel Recurring Transaction

**PATCH** `/recurring-transactions/:id/cancel`

Permanently cancel recurring transaction.

**Response:** `200 OK` (Updated recurring transaction with `status: "cancelled"`)

---

#### 7.7 Update Recurring Transaction

**PATCH** `/recurring-transactions/:id`

**Response:** `200 OK`

---

#### 7.8 Delete Recurring Transaction

**DELETE** `/recurring-transactions/:id`

**Response:** `200 OK`

---

### 8. Budgets Endpoints

#### 8.1 Create Budget

**POST** `/budgets`

Create a new budget.

**Request Body:**
```json
{
  "name": "Groceries Budget",
  "amount": 600.00,
  "period": "monthly",
  "startDate": "2024-02-01",
  "endDate": "2024-02-29",
  "categoryId": "aa0e8400-e29b-41d4-a716-446655440000",
  "rollover": true,
  "isActive": true,
  "notes": "Monthly grocery budget for family of 4"
}
```

**Budget Periods:**
- `weekly`, `monthly`, `quarterly`, `yearly`

**Response:** `201 Created`
```json
{
  "id": "ee0e8400-e29b-41d4-a716-446655440000",
  "name": "Groceries Budget",
  "amount": "600.00",
  "spent": "0.00",
  "period": "monthly",
  "startDate": "2024-02-01",
  "endDate": "2024-02-29",
  "rollover": true,
  "isActive": true,
  "notes": "Monthly grocery budget for family of 4",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "categoryId": "aa0e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T16:00:00.000Z"
}
```

---

#### 8.2 Get All Budgets

**GET** `/budgets`

**Query Parameters:**
- `isActive` (optional): Filter by active status (`true`, `false`)

**Response:** `200 OK` (Array of budgets with category relations)

---

#### 8.3 Get Current Budgets

**GET** `/budgets/current`

Get all currently active budgets.

**Response:** `200 OK`

---

#### 8.4 Get Budget Progress

**GET** `/budgets/:id/progress`

Get detailed budget progress information.

**Response:** `200 OK`
```json
{
  "budget": {
    "id": "ee0e8400-e29b-41d4-a716-446655440000",
    "name": "Groceries Budget",
    "amount": "600.00",
    "spent": "320.50",
    "period": "monthly",
    "category": {
      "name": "Food & Dining",
      "icon": "🍔"
    }
  },
  "percentage": 53.42,
  "remaining": 279.50,
  "isOverBudget": false
}
```

---

#### 8.5 Update Budget

**PATCH** `/budgets/:id`

**Response:** `200 OK`

---

#### 8.6 Delete Budget

**DELETE** `/budgets/:id`

**Response:** `200 OK`

---

### 9. Goals Endpoints

#### 9.1 Create Goal

**POST** `/goals`

Create a savings goal.

**Request Body:**
```json
{
  "name": "Emergency Fund",
  "targetAmount": 10000.00,
  "currentAmount": 2500.00,
  "targetDate": "2024-12-31",
  "description": "Build 6-month emergency fund",
  "color": "#4CAF50",
  "icon": "🛡️",
  "accountId": "880e8400-e29b-41d4-a716-446655440000",
  "milestones": [
    { "amount": 2500, "description": "First quarter", "achieved": true },
    { "amount": 5000, "description": "Halfway there", "achieved": false },
    { "amount": 7500, "description": "Three quarters", "achieved": false },
    { "amount": 10000, "description": "Goal complete!", "achieved": false }
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": "ff0e8400-e29b-41d4-a716-446655440000",
  "name": "Emergency Fund",
  "targetAmount": "10000.00",
  "currentAmount": "2500.00",
  "targetDate": "2024-12-31",
  "status": "in_progress",
  "description": "Build 6-month emergency fund",
  "color": "#4CAF50",
  "icon": "🛡️",
  "milestones": [...],
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "accountId": "880e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-15T17:00:00.000Z"
}
```

---

#### 9.2 Get All Goals

**GET** `/goals`

**Query Parameters:**
- `status` (optional): Filter by status (`in_progress`, `completed`, `cancelled`)

**Response:** `200 OK` (Array of goals)

---

#### 9.3 Get Active Goals

**GET** `/goals/active`

Get only in-progress goals, sorted by target date.

**Response:** `200 OK`

---

#### 9.4 Get Goal Progress

**GET** `/goals/:id/progress`

Get detailed goal progress.

**Response:** `200 OK`
```json
{
  "goal": {
    "id": "ff0e8400-e29b-41d4-a716-446655440000",
    "name": "Emergency Fund",
    "targetAmount": "10000.00",
    "currentAmount": "2500.00",
    "targetDate": "2024-12-31"
  },
  "percentage": 25.00,
  "remaining": 7500.00,
  "daysRemaining": 350,
  "isCompleted": false
}
```

---

#### 9.5 Add to Goal

**PATCH** `/goals/:id/add`

Add money to a goal.

**Request Body:**
```json
{
  "amount": 500.00
}
```

**Response:** `200 OK` (Updated goal with new `currentAmount`)

**Note:** Goal status automatically changes to "completed" when target is reached.

---

#### 9.6 Update Goal

**PATCH** `/goals/:id`

**Response:** `200 OK`

---

#### 9.7 Delete Goal

**DELETE** `/goals/:id`

**Response:** `200 OK`

---

### 10. Dashboard Endpoints

#### 10.1 Get Dashboard Overview

**GET** `/dashboard/overview`

Get comprehensive financial overview.

**Response:** `200 OK`
```json
{
  "totalBalance": 20000.00,
  "accountCount": 3,
  "thisMonth": {
    "income": 5000.00,
    "expenses": 2350.75,
    "netIncome": 2649.25,
    "transactionCount": 47
  },
  "budgets": {
    "total": 3000.00,
    "spent": 1245.80,
    "remaining": 1754.20,
    "percentage": 41.53,
    "count": 5
  },
  "goals": {
    "target": 25000.00,
    "current": 8500.00,
    "remaining": 16500.00,
    "percentage": 34.00,
    "count": 3
  }
}
```

---

#### 10.2 Get Cash Flow

**GET** `/dashboard/cash-flow`

**Query Parameters:**
- `months` (optional): Number of months (default: 6)

**Response:** `200 OK`
```json
[
  {
    "month": "Aug 2023",
    "income": 4500.00,
    "expenses": 2100.50,
    "netIncome": 2399.50
  },
  {
    "month": "Sep 2023",
    "income": 5000.00,
    "expenses": 2350.75,
    "netIncome": 2649.25
  }
]
```

---

#### 10.3 Get Spending by Category

**GET** `/dashboard/spending-by-category`

**Query Parameters:**
- `startDate` (optional): Start date (default: start of current month)
- `endDate` (optional): End date (default: today)

**Response:** `200 OK`
```json
{
  "categories": [
    {
      "name": "Food & Dining",
      "amount": 450.75,
      "count": 12,
      "color": "#FF6B6B",
      "icon": "🍔",
      "percentage": 35.20
    },
    {
      "name": "Transportation",
      "amount": 320.00,
      "count": 8,
      "color": "#4ECDC4",
      "icon": "🚗",
      "percentage": 25.00
    }
  ],
  "total": 1280.00
}
```

---

#### 10.4 Get Income by Category

**GET** `/dashboard/income-by-category`

**Query Parameters:** Same as spending-by-category

**Response:** `200 OK` (Similar structure to spending-by-category)

---

#### 10.5 Get Recent Transactions

**GET** `/dashboard/recent-transactions`

**Query Parameters:**
- `limit` (optional): Number of transactions (default: 10)

**Response:** `200 OK` (Array of recent transactions)

---

#### 10.6 Get Accounts Overview

**GET** `/dashboard/accounts-overview`

**Response:** `200 OK`
```json
{
  "accounts": [
    {
      "id": "880e8400-e29b-41d4-a716-446655440000",
      "name": "Savings Account",
      "type": "savings",
      "balance": 15000.00,
      "currency": "USD",
      "color": "#00AA44",
      "icon": "🏦",
      "percentage": 75.00
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "name": "Chase Checking",
      "type": "checking",
      "balance": 5000.00,
      "currency": "USD",
      "color": "#0066CC",
      "icon": "💳",
      "percentage": 25.00
    }
  ],
  "total": 20000.00,
  "count": 2
}
```

---

#### 10.7 Get Budget Status

**GET** `/dashboard/budget-status`

**Response:** `200 OK`
```json
[
  {
    "id": "ee0e8400-e29b-41d4-a716-446655440000",
    "name": "Groceries Budget",
    "category": "Food & Dining",
    "categoryIcon": "🍔",
    "categoryColor": "#FF6B6B",
    "amount": 600.00,
    "spent": 320.50,
    "remaining": 279.50,
    "percentage": 53.42,
    "period": "monthly",
    "startDate": "2024-02-01",
    "endDate": "2024-02-29",
    "isOverBudget": false
  }
]
```

---

#### 10.8 Get Financial Health

**GET** `/dashboard/financial-health`

AI-based financial health assessment.

**Response:** `200 OK`
```json
{
  "score": 78,
  "status": "Good",
  "insights": [
    {
      "type": "positive",
      "message": "You have a positive account balance"
    },
    {
      "type": "positive",
      "message": "Excellent savings rate: 53%"
    },
    {
      "type": "neutral",
      "message": "80% of budgets are on track"
    },
    {
      "type": "positive",
      "message": "Great progress on your goals!"
    }
  ],
  "metrics": {
    "totalBalance": 20000.00,
    "savingsRate": 52.98,
    "monthlyIncome": 5000.00,
    "monthlyExpenses": 2350.75
  }
}
```

**Scoring System:**
- 0-39: Needs Improvement
- 40-59: Fair
- 60-79: Good
- 80-100: Excellent

---

### 11. Reports Endpoints

#### 11.1 Get Income Statement

**GET** `/reports/income-statement`

**Query Parameters:**
- `startDate` (optional): Start date (default: start of month)
- `endDate` (optional): End date (default: today)

**Response:** `200 OK`
```json
{
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "income": {
    "categories": [
      {
        "name": "Salary",
        "amount": 5000.00,
        "count": 1
      }
    ],
    "total": 5000.00
  },
  "expenses": {
    "categories": [
      {
        "name": "Food & Dining",
        "amount": 450.75,
        "count": 12
      },
      {
        "name": "Transportation",
        "amount": 320.00,
        "count": 8
      }
    ],
    "total": 2350.75
  },
  "netIncome": 2649.25,
  "savingsRate": 52.98
}
```

---

#### 11.2 Get Balance Sheet

**GET** `/reports/balance-sheet`

Current financial position snapshot.

**Response:** `200 OK`
```json
{
  "assets": {
    "accounts": [
      {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "name": "Chase Checking",
        "type": "checking",
        "balance": 5000.00,
        "currency": "USD"
      },
      {
        "id": "880e8400-e29b-41d4-a716-446655440000",
        "name": "Savings Account",
        "type": "savings",
        "balance": 15000.00,
        "currency": "USD"
      }
    ],
    "total": 20000.00
  },
  "liabilities": {
    "accounts": [
      {
        "id": "990e8400-e29b-41d4-a716-446655440000",
        "name": "Credit Card",
        "type": "credit_card",
        "balance": 1500.00,
        "currency": "USD"
      }
    ],
    "total": 1500.00
  },
  "netWorth": 18500.00
}
```

---

#### 11.3 Get Cash Flow Report

**GET** `/reports/cash-flow`

**Query Parameters:**
- `startDate` (optional)
- `endDate` (optional)

**Response:** `200 OK`
```json
{
  "period": {
    "startDate": "2024-01-01",
    "endDate": "2024-01-31"
  },
  "cashInflow": 5000.00,
  "cashOutflow": 2350.75,
  "transfers": 1000.00,
  "netCashFlow": 2649.25,
  "currentBalance": 20000.00
}
```

---

#### 11.4 Get Budget Report

**GET** `/reports/budget`

Comprehensive budget analysis.

**Response:** `200 OK`
```json
{
  "budgets": [
    {
      "id": "ee0e8400-e29b-41d4-a716-446655440000",
      "name": "Groceries Budget",
      "category": "Food & Dining",
      "period": "monthly",
      "startDate": "2024-02-01",
      "endDate": "2024-02-29",
      "amount": 600.00,
      "spent": 320.50,
      "remaining": 279.50,
      "percentage": 53.42,
      "status": "on-track"
    }
  ],
  "summary": {
    "totalBudget": 3000.00,
    "totalSpent": 1245.80,
    "totalRemaining": 1754.20,
    "percentage": 41.53,
    "overBudgetCount": 0,
    "totalBudgetCount": 5
  }
}
```

**Budget Status:**
- `on-track`: < 80% spent
- `near-limit`: 80-99% spent
- `over-budget`: ≥ 100% spent

---

#### 11.5 Get Monthly Comparison

**GET** `/reports/monthly-comparison`

**Query Parameters:**
- `months` (optional): Number of months (default: 6)

**Response:** `200 OK`
```json
{
  "months": [
    {
      "month": "August 2023",
      "income": 4500.00,
      "expenses": 2100.50,
      "netIncome": 2399.50,
      "savingsRate": 53.32,
      "transactionCount": 42
    },
    {
      "month": "September 2023",
      "income": 5000.00,
      "expenses": 2350.75,
      "netIncome": 2649.25,
      "savingsRate": 52.98,
      "transactionCount": 47
    }
  ],
  "averages": {
    "income": 4750.00,
    "expenses": 2225.62,
    "netIncome": 2524.38,
    "savingsRate": 53.15
  }
}
```

---

#### 11.6 Export Transactions

**GET** `/reports/export`

**Query Parameters:**
- `startDate` (optional): Default to start of year
- `endDate` (optional): Default to today

**Response:** `200 OK`
```json
[
  {
    "date": "2024-01-15",
    "type": "expense",
    "amount": 45.99,
    "account": "Chase Checking",
    "category": "Food & Dining",
    "toAccount": null,
    "description": "Grocery shopping at Whole Foods",
    "payee": "Whole Foods Market",
    "notes": "Weekly groceries",
    "tags": ["groceries", "weekly"]
  }
]
```

**Use Case:** Export to CSV/Excel for external analysis.

---

### 12. Search Endpoints

#### 12.1 Advanced Transaction Search

**GET** `/search/transactions`

**Query Parameters:**
- `query` (optional): Text search (description, notes, payee)
- `type` (optional): Transaction type
- `accountIds` (optional): Comma-separated account IDs
- `categoryIds` (optional): Comma-separated category IDs
- `minAmount` (optional): Minimum amount
- `maxAmount` (optional): Maximum amount
- `startDate` (optional): Start date
- `endDate` (optional): End date
- `tags` (optional): Comma-separated tags
- `payee` (optional): Payee name

**Example:**
```
/search/transactions?query=grocery&categoryIds=aa0e8400-e29b-41d4-a716-446655440000&minAmount=20&maxAmount=100&startDate=2024-01-01
```

**Response:** `200 OK` (Array of matching transactions, max 100)

---

#### 12.2 Search Accounts

**GET** `/search/accounts?query=checking`

**Response:** `200 OK` (Array of matching accounts)

---

#### 12.3 Search Categories

**GET** `/search/categories?query=food`

**Response:** `200 OK` (Array of matching categories)

---

#### 12.4 Search Budgets

**GET** `/search/budgets?query=grocery`

**Response:** `200 OK` (Array of matching budgets)

---

#### 12.5 Search Goals

**GET** `/search/goals?query=emergency`

**Response:** `200 OK` (Array of matching goals)

---

#### 12.6 Global Search

**GET** `/search/global?query=grocery`

Search across all entities simultaneously.

**Response:** `200 OK`
```json
{
  "transactions": [
    {
      "id": "bb0e8400-e29b-41d4-a716-446655440000",
      "description": "Grocery shopping at Whole Foods",
      "amount": "45.99"
    }
  ],
  "accounts": [],
  "categories": [
    {
      "id": "aa0e8400-e29b-41d4-a716-446655440000",
      "name": "Food & Dining"
    }
  ],
  "budgets": [
    {
      "id": "ee0e8400-e29b-41d4-a716-446655440000",
      "name": "Groceries Budget"
    }
  ],
  "goals": [],
  "total": 12
}
```

---

#### 12.7 Search Statistics

**GET** `/search/stats`

Get statistics for filtered transactions.

**Query Parameters:** Same as transaction search

**Response:** `200 OK`
```json
{
  "totalTransactions": 15,
  "totalIncome": 0.00,
  "totalExpenses": 567.85,
  "netIncome": -567.85,
  "topCategories": [
    {
      "name": "Food & Dining",
      "amount": 450.75,
      "count": 12
    },
    {
      "name": "Transportation",
      "amount": 117.10,
      "count": 3
    }
  ]
}
```

---

### 13. Notifications Endpoints

#### 13.1 Get All Notifications

**GET** `/notifications`

**Query Parameters:**
- `unreadOnly` (optional): `true` to get only unread notifications

**Response:** `200 OK`
```json
[
  {
    "id": "11111111-e29b-41d4-a716-446655440000",
    "type": "budget_alert",
    "priority": "medium",
    "title": "Budget Warning: Groceries Budget",
    "message": "You've used 85% of your Groceries Budget budget. $90.00 remaining.",
    "data": {
      "budgetId": "ee0e8400-e29b-41d4-a716-446655440000",
      "percentage": 85,
      "remaining": 90.00
    },
    "isRead": false,
    "readAt": null,
    "isActionable": true,
    "actionUrl": "/budgets/ee0e8400-e29b-41d4-a716-446655440000",
    "actionLabel": "View Budget",
    "createdAt": "2024-01-15T08:00:00.000Z"
  },
  {
    "id": "22222222-e29b-41d4-a716-446655440000",
    "type": "goal_milestone",
    "priority": "medium",
    "title": "Milestone Reached: Emergency Fund",
    "message": "Great progress! You're 50% of the way to your goal. Keep it up!",
    "data": {
      "goalId": "ff0e8400-e29b-41d4-a716-446655440000",
      "percentage": 50,
      "milestone": 50
    },
    "isRead": true,
    "readAt": "2024-01-15T10:30:00.000Z",
    "isActionable": true,
    "actionUrl": "/goals/ff0e8400-e29b-41d4-a716-446655440000",
    "actionLabel": "View Goal",
    "createdAt": "2024-01-14T08:00:00.000Z"
  }
]
```

**Notification Types:**
- `budget_alert` - Budget at 80%
- `budget_exceeded` - Budget over 100%
- `goal_milestone` - Goal milestone reached (25%, 50%, 75%)
- `goal_completed` - Goal 100% complete
- `recurring_upcoming` - Recurring transaction due soon
- `low_balance` - Account balance low
- `unusual_spending` - Unusual spending detected (future)
- `monthly_summary` - Monthly report (future)
- `system` - System notifications

---

#### 13.2 Get Unread Count

**GET** `/notifications/unread-count`

**Response:** `200 OK`
```json
{
  "count": 3
}
```

---

#### 13.3 Get Notification by ID

**GET** `/notifications/:id`

**Response:** `200 OK` (Single notification object)

---

#### 13.4 Mark Notification as Read

**PATCH** `/notifications/:id/read`

**Response:** `200 OK` (Updated notification with `isRead: true`)

---

#### 13.5 Mark All as Read

**PATCH** `/notifications/read-all`

**Response:** `200 OK`

---

#### 13.6 Delete Notification

**DELETE** `/notifications/:id`

**Response:** `200 OK`

---

#### 13.7 Delete All Notifications

**DELETE** `/notifications`

**Response:** `200 OK`

---

### 14. Health Check

#### 14.1 Health Check

**GET** `/health`

**Response:** `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T18:00:00.000Z",
  "uptime": 86400,
  "database": {
    "status": "connected",
    "type": "postgres"
  }
}
```

---

## 🗄 Database Schema

### Tables Overview

```sql
users                        # User accounts
user_preferences             # User settings
accounts                     # Financial accounts
categories                   # Transaction categories
transactions                 # Financial transactions
recurring_transactions       # Automated transactions
budgets                      # Budget tracking
goals                        # Savings goals
notifications                # Alert system
```

### Entity Relationships

```
users (1) ----< (*) accounts
users (1) ----< (*) categories
users (1) ----< (*) transactions
users (1) ----< (*) recurring_transactions
users (1) ----< (*) budgets
users (1) ----< (*) goals
users (1) ----< (*) notifications
users (1) ----o (1) user_preferences

accounts (1) ----< (*) transactions [from account]
accounts (1) ----< (*) transactions [to account - transfers]
accounts (1) ----< (*) recurring_transactions

categories (1) ----< (*) transactions
categories (1) ----< (*) recurring_transactions
categories (1) ----< (*) budgets
```

### Enums

```typescript
AccountType = 'checking' | 'savings' | 'credit_card' | 'cash' | 'investment' | 'loan' | 'other'

CategoryType = 'income' | 'expense'

TransactionType = 'income' | 'expense' | 'transfer'

RecurringFrequency = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'

RecurringStatus = 'active' | 'paused' | 'completed' | 'cancelled'

BudgetPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly'

GoalStatus = 'in_progress' | 'completed' | 'cancelled'

NotificationType = 'budget_alert' | 'budget_exceeded' | 'goal_milestone' | 'goal_completed' | 'recurring_upcoming' | 'low_balance' | 'unusual_spending' | 'monthly_summary' | 'system'

NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'
```

---

## ⏰ Automated Tasks

The scheduler runs cron jobs daily to automate financial management:

### Daily Jobs

**1:00 AM** - Process Recurring Transactions
- Scans for due recurring transactions
- Auto-creates actual transactions
- Updates next occurrence dates
- Increments occurrence counter

**2:00 AM** - Budget Alerts
- Checks all active budgets
- Sends warning at 80% usage
- Sends alert when exceeded

**3:00 AM** - Goal Milestones
- Checks goal progress
- Celebrates 25%, 50%, 75%, 100% milestones
- Auto-completes goals at 100%

**4:00 AM** - Low Balance Alerts
- Checks account balances
- Warns when balance < $100
- Alerts for negative balances

**5:00 AM** - Recurring Reminders
- Checks upcoming recurring transactions
- Sends reminders based on user preferences

**6:00 AM** - All Notification Checks
- Runs comprehensive health check
- Generates all applicable notifications

### Hourly Jobs

**Every Hour** - Maintenance
- Cleanup old notifications (future)
- Database maintenance (future)

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run start:dev          # Start dev server with hot reload

# Build
npm run build              # Compile TypeScript to JavaScript

# Production
npm start                  # Start production server

# Database
npm run migration:run      # Run pending migrations
npm run migration:revert   # Revert last migration

# Code Quality
npm run lint               # Run ESLint
npm run format             # Format code with Prettier
```

### Testing API Endpoints

**Using cURL:**

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","fullName":"Test User","password":"password123"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create Account (with JWT)
curl -X POST http://localhost:3000/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"My Account","type":"checking","balance":1000}'
```

**Using Postman/Insomnia:**

1. Import collection from `/docs/postman_collection.json` (if provided)
2. Set environment variable `baseUrl` = `http://localhost:3000`
3. Set environment variable `token` after login
4. Use `{{baseUrl}}` and `{{token}}` in requests

---

## 🔒 Security Best Practices

1. **Environment Variables** - Never commit `.env` file
2. **JWT Secret** - Use strong, random secret in production
3. **Password Hashing** - bcryptjs with salt rounds
4. **SQL Injection** - TypeORM parameterized queries
5. **CORS** - Configure allowed origins
6. **Rate Limiting** - Implement in production
7. **HTTPS** - Always use SSL in production

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📞 Support

For issues and questions:
- GitHub Issues: https://github.com/leandre000/Finance-Manager-AiBased/issues
- Email: support@financemanager.com (placeholder)

---

**Built with ❤️ using NestJS and TypeScript**
