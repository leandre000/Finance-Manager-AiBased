import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module.js';
import { ConfigModule } from './config/config.module.js';

@Module({
  imports: [ConfigModule, HealthModule]
})
export class AppModule {}
