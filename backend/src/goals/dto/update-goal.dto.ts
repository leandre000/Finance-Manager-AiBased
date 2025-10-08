import { PartialType } from '@nestjs/mapped-types';
import { CreateGoalDto } from './create-goal.dto.js';

export class UpdateGoalDto extends PartialType(CreateGoalDto) {}

