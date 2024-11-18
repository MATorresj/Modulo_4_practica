import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) {}

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      relations: ['products']
    });
  }

  async addCategories(categoryData: { name: string }) {
    const categories = await this.getCategories();
    const newCategory = await this.categoryRepository.create(categoryData);
    const existingCategory = categories.find(
      (cat) => cat.name === newCategory.name
    );
    if (existingCategory) {
      return null;
    }
    return await this.categoryRepository.save(newCategory);
  }

  // async findOne(name: string): Promise<Category | undefined> {
  //   return await this.categoryRepository.findOne({
  //     where: { name }
  //   });
  // }
}
