import { Module } from '@nestjs/common';

import { AccountsModule } from './accounts/accounts.module.js';
import { AuthModule } from './auth/auth.module.js';
import { BudgetsModule } from './budgets/budgets.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { ConfigModule } from './config/config.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';
import { DatabaseModule } from './database/database.module.js';
import { GoalsModule } from './goals/goals.module.js';
import { HealthModule } from './health/health.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { RecurringTransactionsModule } from './recurring-transactions/recurring-transactions.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { SchedulerModule } from './scheduler/scheduler.module.js';
import { SearchModule } from './search/search.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { UserPreferencesModule } from './user-preferences/user-preferences.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    HealthModule,
    AuthModule,
    UsersModule,
    AccountsModule,
    CategoriesModule,
    TransactionsModule,
    BudgetsModule,
    GoalsModule,
    DashboardModule,
    ReportsModule,
    RecurringTransactionsModule,
    NotificationsModule,
    UserPreferencesModule,
    SearchModule,
    SchedulerModule
  ]
})
export class AppModule {}
