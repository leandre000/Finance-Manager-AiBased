import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPreference } from './entities/user-preference.entity';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';

@Injectable()
export class UserPreferencesService {
  constructor(
    @InjectRepository(UserPreference)
    private readonly userPreferenceRepository: Repository<UserPreference>
  ) {}

  async findOrCreate(userId: string): Promise<UserPreference> {
    let preference = await this.userPreferenceRepository.findOne({
      where: { userId }
    });

    if (!preference) {
      preference = this.userPreferenceRepository.create({ userId });
      preference = await this.userPreferenceRepository.save(preference);
    }

    return preference;
  }

  async update(userId: string, updateDto: UpdateUserPreferenceDto): Promise<UserPreference> {
    let preference = await this.userPreferenceRepository.findOne({
      where: { userId }
    });

    if (!preference) {
      preference = this.userPreferenceRepository.create({
        userId,
        ...updateDto
      });
    } else {
      Object.assign(preference, updateDto);
    }

    return await this.userPreferenceRepository.save(preference);
  }

  async reset(userId: string): Promise<UserPreference> {
    await this.userPreferenceRepository.delete({ userId });
    
    const preference = this.userPreferenceRepository.create({ userId });
    return await this.userPreferenceRepository.save(preference);
  }

  async updateDashboardWidgets(userId: string, widgets: string[]): Promise<UserPreference> {
    const preference = await this.findOrCreate(userId);
    preference.dashboardWidgets = widgets;
    return await this.userPreferenceRepository.save(preference);
  }

  async hideCategory(userId: string, categoryId: string): Promise<UserPreference> {
    const preference = await this.findOrCreate(userId);
    const hidden = preference.hiddenCategories || [];
    
    if (!hidden.includes(categoryId)) {
      hidden.push(categoryId);
      preference.hiddenCategories = hidden;
      return await this.userPreferenceRepository.save(preference);
    }

    return preference;
  }

  async unhideCategory(userId: string, categoryId: string): Promise<UserPreference> {
    const preference = await this.findOrCreate(userId);
    const hidden = preference.hiddenCategories || [];
    
    preference.hiddenCategories = hidden.filter(id => id !== categoryId);
    return await this.userPreferenceRepository.save(preference);
  }
}

