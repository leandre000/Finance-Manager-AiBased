import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoalsService } from './goals.service.js';
import { GoalsController } from './goals.controller.js';
import { Goal } from './entities/goal.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Goal])],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService]
})
export class GoalsModule {}

