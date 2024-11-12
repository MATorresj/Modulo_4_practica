import {
  Controller,
  Get,
  Post,
  InternalServerErrorException
} from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async getCategories() {
    try {
      return await this.categoriesService.getCategories();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener las categorías: ${error}`
      );
    }
  }

  @Post('seeder')
  async seedCategories() {
    try {
      return await this.categoriesService.seedCategories();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al hacer el seed las categorías: ${error}`
      );
    }
  }
}
