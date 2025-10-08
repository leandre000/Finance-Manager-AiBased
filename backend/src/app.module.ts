import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module.js';
import { HealthModule } from './health/health.module.js';

@Module({
  imports: [ConfigModule, HealthModule]
})
export class AppModule {}
