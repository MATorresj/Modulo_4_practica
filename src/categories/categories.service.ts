import { Injectable } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async seedCategories() {
    const categories = [
      { name: 'smartphone' },
      { name: 'monitor' },
      { name: 'keyboard' },
      { name: 'mouse' }
    ];

    const promises = categories.map((category) =>
      this.categoriesRepository.addCategories(category)
    );
    await Promise.all(promises);

    const insertedCategories = await this.categoriesRepository.getCategories();

    return insertedCategories.map((category) => ({
      id: category.id,
      name: category.name
    }));
  }

  async getCategories(): Promise<Category[]> {
    return this.categoriesRepository.getCategories();
  }
}
