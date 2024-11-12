import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../products.service';
import { ProductsRepository } from '../products.repository';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { CategoriesService } from '../../categories/categories.service';
import { FilesService } from '../../files/files.service';

// Mock para el repositorio de productos
export const mockProductsRepository = {
  getProducts: jest.fn(),
  getById: jest.fn(),
  getByName: jest.fn(),
  deleteProduct: jest.fn(),
  updateProduct: jest.fn(),
  createProduct: jest.fn()
};

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productsRepository: ProductsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: ProductsRepository, // Proporciona el mock del repositorio
          useValue: mockProductsRepository
        },
        {
          provide: CategoriesService,
          useValue: {} // Mock para CategoriesService
        },
        {
          provide: FilesService,
          useValue: {} // Mock para FilesService
        }
      ]
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<ProductsRepository>(ProductsRepository);
  });

  describe('getProducts', () => {
    it('should return a list of products', async () => {
      const result = {
        products: [
          {
            id: '1',
            name: 'Product 1',
            description: 'Description 1',
            price: 100,
            stock: 10,
            imgUrl: 'https://example.com/image1.png',
            categoryId: '1',
            category: null,
            orderDetails: []
          }
        ],
        total: 1
      };

      jest.spyOn(productsRepository, 'getProducts').mockResolvedValue(result);

      const products = await productsService.getProducts(1, 10);
      expect(products).toEqual(result);
    });
  });

  describe('getById', () => {
    it('should return a product by id', async () => {
      const product: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
        imgUrl: 'https://example.com/image1.png',
        categoryId: '1',
        category: null,
        orderDetails: []
      };

      jest.spyOn(productsRepository, 'getById').mockResolvedValue(product);

      const foundProduct = await productsService.getProductById('1');
      expect(foundProduct).toEqual(product);
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 200,
        stock: 5,
        imgUrl: 'https://example.com/image2.png',
        categoryId: '1'
      };

      const createdProduct: Product = {
        id: '2',
        ...createProductDto,
        orderDetails: [],
        category: null
      };

      jest
        .spyOn(productsRepository, 'createProduct')
        .mockResolvedValue(createdProduct);

      const result = await productsService.createProduct(createProductDto);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update an existing product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 150,
        stock: 8,
        imgUrl: 'https://example.com/image3.png'
      };

      const existingProduct: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
        imgUrl: 'https://example.com/image1.png',
        categoryId: '1',
        category: null,
        orderDetails: []
      };

      const updatedProduct: Product = {
        ...existingProduct,
        ...updateProductDto
      };

      jest
        .spyOn(productsRepository, 'getById')
        .mockResolvedValue(existingProduct);
      jest
        .spyOn(productsRepository, 'updateProduct')
        .mockResolvedValue(updatedProduct);

      const result = await productsService.updateProduct('1', updateProductDto);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product by id', async () => {
      const existingProduct: Product = {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
        imgUrl: 'https://example.com/image1.png',
        categoryId: '1',
        category: null,
        orderDetails: []
      };

      jest
        .spyOn(productsRepository, 'getById')
        .mockResolvedValue(existingProduct);
      jest
        .spyOn(productsRepository, 'deleteProduct')
        .mockResolvedValue(existingProduct);

      await productsService.deleteProduct('1');
      expect(productsRepository.deleteProduct).toHaveBeenCalledWith('1');
    });
  });
});
