import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRecurringTransactionsNotificationsPreferences1730000000002 implements MigrationInterface {
  name = 'AddRecurringTransactionsNotificationsPreferences1730000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create recurring_transactions table
    await queryRunner.query(`
      CREATE TYPE "recurring_frequency_enum" AS ENUM ('daily', 'weekly', 'biweekly', 'monthly', 'quarterly', 'yearly');
      CREATE TYPE "recurring_status_enum" AS ENUM ('active', 'paused', 'completed', 'cancelled');
      
      CREATE TABLE "recurring_transactions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" VARCHAR(255) NOT NULL,
        "type" "transaction_type_enum" NOT NULL,
        "amount" DECIMAL(15,2) NOT NULL,
        "frequency" "recurring_frequency_enum" NOT NULL,
        "startDate" DATE NOT NULL,
        "endDate" DATE,
        "nextOccurrence" DATE NOT NULL,
        "lastProcessed" DATE,
        "status" "recurring_status_enum" DEFAULT 'active',
        "description" TEXT,
        "notes" TEXT,
        "payee" VARCHAR(255),
        "tags" JSONB,
        "occurrenceCount" INTEGER DEFAULT 0,
        "maxOccurrences" INTEGER,
        "autoCreate" BOOLEAN DEFAULT true,
        "notifyBeforeCreation" BOOLEAN DEFAULT false,
        "notifyDaysBefore" INTEGER DEFAULT 1,
        "userId" uuid NOT NULL,
        "accountId" uuid NOT NULL,
        "categoryId" uuid,
        "toAccountId" uuid,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now(),
        CONSTRAINT "fk_recurring_transactions_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_recurring_transactions_account" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_recurring_transactions_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_recurring_transactions_to_account" FOREIGN KEY ("toAccountId") REFERENCES "accounts"("id") ON DELETE SET NULL
      )
    `);

    // Create notifications table
    await queryRunner.query(`
      CREATE TYPE "notification_type_enum" AS ENUM ('budget_alert', 'budget_exceeded', 'goal_milestone', 'goal_completed', 'recurring_upcoming', 'low_balance', 'unusual_spending', 'monthly_summary', 'system');
      CREATE TYPE "notification_priority_enum" AS ENUM ('low', 'medium', 'high', 'urgent');
      
      CREATE TABLE "notifications" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "type" "notification_type_enum" NOT NULL,
        "priority" "notification_priority_enum" DEFAULT 'medium',
        "title" VARCHAR(255) NOT NULL,
        "message" TEXT NOT NULL,
        "data" JSONB,
        "isRead" BOOLEAN DEFAULT false,
        "readAt" TIMESTAMP,
        "isActionable" BOOLEAN DEFAULT false,
        "actionUrl" VARCHAR(255),
        "actionLabel" VARCHAR(100),
        "userId" uuid NOT NULL,
        "createdAt" TIMESTAMP DEFAULT now(),
        CONSTRAINT "fk_notifications_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create user_preferences table
    await queryRunner.query(`
      CREATE TABLE "user_preferences" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "defaultCurrency" VARCHAR(3) DEFAULT 'USD',
        "locale" VARCHAR(10) DEFAULT 'en-US',
        "timezone" VARCHAR(50) DEFAULT 'UTC',
        "dateFormat" VARCHAR(20) DEFAULT 'YYYY-MM-DD',
        "enableNotifications" BOOLEAN DEFAULT true,
        "emailNotifications" BOOLEAN DEFAULT true,
        "pushNotifications" BOOLEAN DEFAULT false,
        "budgetAlerts" BOOLEAN DEFAULT true,
        "goalMilestones" BOOLEAN DEFAULT true,
        "lowBalanceAlerts" BOOLEAN DEFAULT true,
        "lowBalanceThreshold" DECIMAL(15,2) DEFAULT 100,
        "recurringReminders" BOOLEAN DEFAULT true,
        "recurringReminderDays" INTEGER DEFAULT 3,
        "monthlyReports" BOOLEAN DEFAULT false,
        "weeklyDigest" BOOLEAN DEFAULT false,
        "theme" VARCHAR(10) DEFAULT 'light',
        "dashboardWidgets" JSONB,
        "hiddenCategories" JSONB,
        "customSettings" JSONB,
        "userId" uuid UNIQUE NOT NULL,
        "createdAt" TIMESTAMP DEFAULT now(),
        "updatedAt" TIMESTAMP DEFAULT now(),
        CONSTRAINT "fk_user_preferences_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // Create indices for better performance
    await queryRunner.query(`CREATE INDEX "idx_recurring_transactions_user" ON "recurring_transactions"("userId")`);
    await queryRunner.query(`CREATE INDEX "idx_recurring_transactions_next_occurrence" ON "recurring_transactions"("nextOccurrence")`);
    await queryRunner.query(`CREATE INDEX "idx_recurring_transactions_status" ON "recurring_transactions"("status")`);
    await queryRunner.query(`CREATE INDEX "idx_notifications_user" ON "notifications"("userId")`);
    await queryRunner.query(`CREATE INDEX "idx_notifications_read" ON "notifications"("isRead")`);
    await queryRunner.query(`CREATE INDEX "idx_notifications_created" ON "notifications"("createdAt")`);
    await queryRunner.query(`CREATE INDEX "idx_user_preferences_user" ON "user_preferences"("userId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indices
    await queryRunner.query(`DROP INDEX "idx_user_preferences_user"`);
    await queryRunner.query(`DROP INDEX "idx_notifications_created"`);
    await queryRunner.query(`DROP INDEX "idx_notifications_read"`);
    await queryRunner.query(`DROP INDEX "idx_notifications_user"`);
    await queryRunner.query(`DROP INDEX "idx_recurring_transactions_status"`);
    await queryRunner.query(`DROP INDEX "idx_recurring_transactions_next_occurrence"`);
    await queryRunner.query(`DROP INDEX "idx_recurring_transactions_user"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "user_preferences"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "recurring_transactions"`);

    // Drop enums
    await queryRunner.query(`DROP TYPE "notification_priority_enum"`);
    await queryRunner.query(`DROP TYPE "notification_type_enum"`);
    await queryRunner.query(`DROP TYPE "recurring_status_enum"`);
    await queryRunner.query(`DROP TYPE "recurring_frequency_enum"`);
  }
}

