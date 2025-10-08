import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from './create-account.dto.js';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}

