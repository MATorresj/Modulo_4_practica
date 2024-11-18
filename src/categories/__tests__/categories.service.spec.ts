import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from '../categories.service';
import { CategoriesRepository } from '../categories.repository';
import { Category } from '../category.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repositoryMock: Partial<CategoriesRepository>;

  beforeEach(async () => {
    repositoryMock = {
      getCategories: jest.fn(),
      addCategories: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CategoriesRepository,
          useValue: repositoryMock
        }
      ]
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('getCategories', () => {
    it('debe devolver las categorías correctamente', async () => {
      const mockCategories: Category[] = [
        { id: '1', name: 'smartphone', products: [] },
        { id: '2', name: 'monitor', products: [] }
      ] as Category[];

      (repositoryMock.getCategories as jest.Mock).mockResolvedValue(
        mockCategories
      );

      const categories = await service.getCategories();
      expect(categories).toEqual(mockCategories);
      expect(repositoryMock.getCategories).toHaveBeenCalled();
    });

    it('debe lanzar un error si getCategories falla', async () => {
      (repositoryMock.getCategories as jest.Mock).mockRejectedValue(
        new Error('Error al obtener las categorías')
      );

      await expect(service.getCategories()).rejects.toThrow(Error);
    });
  });

  describe('seedCategories', () => {
    it('debe insertar las categorías correctamente', async () => {
      const mockInsertedCategories = [
        { id: '1', name: 'smartphone' },
        { id: '2', name: 'monitor' }
      ];

      (repositoryMock.addCategories as jest.Mock).mockResolvedValueOnce(
        undefined
      );
      (repositoryMock.getCategories as jest.Mock).mockResolvedValue(
        mockInsertedCategories as Category[]
      );

      const result = await service.seedCategories();
      expect(result).toEqual(
        mockInsertedCategories.map((cat) => ({
          id: cat.id,
          name: cat.name
        }))
      );
      expect(repositoryMock.addCategories).toHaveBeenCalledTimes(4);
      expect(repositoryMock.getCategories).toHaveBeenCalled();
    });

    it('debe lanzar un error si addCategories falla', async () => {
      (repositoryMock.addCategories as jest.Mock).mockRejectedValue(
        new Error('Error al insertar categoría')
      );

      await expect(service.seedCategories()).rejects.toThrow(Error);
    });
  });
});
