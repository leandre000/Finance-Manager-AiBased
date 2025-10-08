import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from './config/config.module.js';
import { DatabaseModule } from './database/database.module.js';
import { HealthModule } from './health/health.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [ConfigModule, DatabaseModule, HealthModule, AuthModule, UsersModule]
})
export class AppModule {}
