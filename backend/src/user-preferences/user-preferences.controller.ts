import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  Post,
  Param
} from '@nestjs/common';
import { UserPreferencesService } from './user-preferences.service.js';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@Controller('user-preferences')
@UseGuards(JwtAuthGuard)
export class UserPreferencesController {
  constructor(private readonly userPreferencesService: UserPreferencesService) {}

  @Get()
  get(@Request() req: any) {
    return this.userPreferencesService.findOrCreate(req.user.userId);
  }

  @Patch()
  update(@Request() req: any, @Body() updateDto: UpdateUserPreferenceDto) {
    return this.userPreferencesService.update(req.user.userId, updateDto);
  }

  @Post('reset')
  reset(@Request() req: any) {
    return this.userPreferencesService.reset(req.user.userId);
  }

  @Patch('dashboard-widgets')
  updateDashboardWidgets(@Request() req: any, @Body() body: { widgets: string[] }) {
    return this.userPreferencesService.updateDashboardWidgets(req.user.userId, body.widgets);
  }

  @Patch('hide-category/:categoryId')
  hideCategory(@Request() req: any, @Param('categoryId') categoryId: string) {
    return this.userPreferencesService.hideCategory(req.user.userId, categoryId);
  }

  @Patch('unhide-category/:categoryId')
  unhideCategory(@Request() req: any, @Param('categoryId') categoryId: string) {
    return this.userPreferencesService.unhideCategory(req.user.userId, categoryId);
  }
}

