import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '../categories.controller';
import { CategoriesService } from '../categories.service';
import { InternalServerErrorException } from '@nestjs/common';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const categoriesServiceMock = {
    getCategories: jest.fn(),
    seedCategories: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: categoriesServiceMock
        }
      ]
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getCategories', () => {
    it('debe retornar todas las categorías', async () => {
      const result = [{ id: '1', name: 'smartphone' }];
      categoriesServiceMock.getCategories.mockResolvedValue(result);

      expect(await controller.getCategories()).toBe(result);
      expect(categoriesServiceMock.getCategories).toHaveBeenCalled();
    });

    it('debe lanzar un InternalServerErrorException si ocurre un error', async () => {
      categoriesServiceMock.getCategories.mockRejectedValue(
        new Error('Error al obtener categorías')
      );

      await expect(controller.getCategories()).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('seedCategories', () => {
    it('debe hacer el seed de categorías y retornar las categorías insertadas', async () => {
      const result = [{ id: '1', name: 'smartphone' }];
      categoriesServiceMock.seedCategories.mockResolvedValue(result);

      expect(await controller.seedCategories()).toBe(result);
      expect(categoriesServiceMock.seedCategories).toHaveBeenCalled();
    });

    it('debe lanzar un InternalServerErrorException si ocurre un error', async () => {
      categoriesServiceMock.seedCategories.mockRejectedValue(
        new Error('Error al hacer el seed')
      );

      await expect(controller.seedCategories()).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
