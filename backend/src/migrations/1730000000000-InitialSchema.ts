import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1730000000000 implements MigrationInterface {
  name = 'InitialSchema1730000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" VARCHAR(255) UNIQUE NOT NULL,
        "fullName" VARCHAR(255) NOT NULL,
        "password" VARCHAR NOT NULL,
        "isActive" BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now()
      )
    `);

    // Create accounts table
    await queryRunner.query(`
      CREATE TYPE "account_type_enum" AS ENUM ('checking', 'savings', 'credit_card', 'cash', 'investment', 'loan', 'other');
      
      CREATE TABLE "accounts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "type" "account_type_enum" DEFAULT 'checking',
        "balance" DECIMAL(15,2) DEFAULT 0,
        "creditLimit" DECIMAL(15,2),
        "currency" VARCHAR(3) DEFAULT 'USD',
        "color" VARCHAR(7),
        "icon" VARCHAR(50),
        "description" TEXT,
        "isActive" BOOLEAN DEFAULT true,
        "includeInTotal" BOOLEAN DEFAULT true,
        "userId" uuid NOT NULL,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now(),
        CONSTRAINT "fk_accounts_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create categories table
    await queryRunner.query(`
      CREATE TYPE "category_type_enum" AS ENUM ('income', 'expense');
      
      CREATE TABLE "categories" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "type" "category_type_enum" DEFAULT 'expense',
        "color" VARCHAR(7),
        "icon" VARCHAR(50),
        "description" TEXT,
        "isSystem" BOOLEAN DEFAULT false,
        "userId" uuid,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now(),
        CONSTRAINT "fk_categories_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create transactions table
    await queryRunner.query(`
      CREATE TYPE "transaction_type_enum" AS ENUM ('income', 'expense', 'transfer');
      
      CREATE TABLE "transactions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "type" "transaction_type_enum" NOT NULL,
        "amount" DECIMAL(15,2) NOT NULL,
        "date" DATE NOT NULL,
        "description" TEXT,
        "notes" TEXT,
        "payee" VARCHAR(255),
        "tags" JSONB,
        "attachments" JSONB,
        "userId" uuid NOT NULL,
        "accountId" uuid NOT NULL,
        "categoryId" uuid,
        "toAccountId" uuid,
        "isRecurring" BOOLEAN DEFAULT false,
        "recurringFrequency" VARCHAR(50),
        "parentTransactionId" uuid,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now(),
        CONSTRAINT "fk_transactions_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_transactions_account" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_transactions_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_transactions_to_account" FOREIGN KEY ("toAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL
      )
    `);

    // Create budgets table
    await queryRunner.query(`
      CREATE TYPE "budget_period_enum" AS ENUM ('weekly', 'monthly', 'quarterly', 'yearly');
      
      CREATE TABLE "budgets" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "amount" DECIMAL(15,2) NOT NULL,
        "spent" DECIMAL(15,2) DEFAULT 0,
        "period" "budget_period_enum" DEFAULT 'monthly',
        "startDate" DATE NOT NULL,
        "endDate" DATE NOT NULL,
        "rollover" BOOLEAN DEFAULT true,
        "isActive" BOOLEAN DEFAULT true,
        "notes" TEXT,
        "userId" uuid NOT NULL,
        "categoryId" uuid,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now(),
        CONSTRAINT "fk_budgets_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_budgets_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL
      )
    `);

    // Create goals table
    await queryRunner.query(`
      CREATE TYPE "goal_status_enum" AS ENUM ('in_progress', 'completed', 'cancelled');
      
      CREATE TABLE "goals" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "targetAmount" DECIMAL(15,2) NOT NULL,
        "currentAmount" DECIMAL(15,2) DEFAULT 0,
        "targetDate" DATE,
        "status" "goal_status_enum" DEFAULT 'in_progress',
        "color" VARCHAR(7),
        "icon" VARCHAR(50),
        "description" TEXT,
        "milestones" JSONB,
        "userId" uuid NOT NULL,
        "accountId" uuid,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now(),
        CONSTRAINT "fk_goals_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_goals_account" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE SET NULL
      )
    `);

    // Create indices for better performance
    await queryRunner.query(`CREATE INDEX "idx_accounts_user" ON "accounts"("userId")`);
    await queryRunner.query(`CREATE INDEX "idx_categories_user" ON "categories"("userId")`);
    await queryRunner.query(`CREATE INDEX "idx_categories_system" ON "categories"("isSystem")`);
    await queryRunner.query(`CREATE INDEX "idx_transactions_user" ON "transactions"("userId")`);
    await queryRunner.query(`CREATE INDEX "idx_transactions_account" ON "transactions"("accountId")`);
    await queryRunner.query(`CREATE INDEX "idx_transactions_category" ON "transactions"("categoryId")`);
    await queryRunner.query(`CREATE INDEX "idx_transactions_date" ON "transactions"("date")`);
    await queryRunner.query(`CREATE INDEX "idx_budgets_user" ON "budgets"("userId")`);
    await queryRunner.query(`CREATE INDEX "idx_budgets_dates" ON "budgets"("startDate", "endDate")`);
    await queryRunner.query(`CREATE INDEX "idx_goals_user" ON "goals"("userId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indices
    await queryRunner.query(`DROP INDEX "idx_goals_user"`);
    await queryRunner.query(`DROP INDEX "idx_budgets_dates"`);
    await queryRunner.query(`DROP INDEX "idx_budgets_user"`);
    await queryRunner.query(`DROP INDEX "idx_transactions_date"`);
    await queryRunner.query(`DROP INDEX "idx_transactions_category"`);
    await queryRunner.query(`DROP INDEX "idx_transactions_account"`);
    await queryRunner.query(`DROP INDEX "idx_transactions_user"`);
    await queryRunner.query(`DROP INDEX "idx_categories_system"`);
    await queryRunner.query(`DROP INDEX "idx_categories_user"`);
    await queryRunner.query(`DROP INDEX "idx_accounts_user"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "goals"`);
    await queryRunner.query(`DROP TABLE "budgets"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE "goal_status_enum"`);
    await queryRunner.query(`DROP TYPE "budget_period_enum"`);
    await queryRunner.query(`DROP TYPE "transaction_type_enum"`);
    await queryRunner.query(`DROP TYPE "category_type_enum"`);
    await queryRunner.query(`DROP TYPE "account_type_enum"`);
  }
}

