import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(userId: string, createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create({
      ...createCategoryDto,
      userId,
      isSystem: false
    });
    return await this.categoryRepository.save(category);
  }

  async findAll(userId: string): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: [
        { userId },
        { isSystem: true }
      ],
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string, userId: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: [
        { id, userId },
        { id, isSystem: true }
      ]
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(id: string, userId: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id, userId }
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found or you don't have permission to update it`);
    }

    if (category.isSystem) {
      throw new NotFoundException('Cannot update system categories');
    }

    Object.assign(category, updateCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async remove(id: string, userId: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id, userId }
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found or you don't have permission to delete it`);
    }

    if (category.isSystem) {
      throw new NotFoundException('Cannot delete system categories');
    }

    await this.categoryRepository.remove(category);
  }

  async findByType(userId: string, type: 'income' | 'expense'): Promise<Category[]> {
    return await this.categoryRepository.find({
      where: [
        { userId, type },
        { isSystem: true, type }
      ],
      order: { name: 'ASC' }
    });
  }
}

