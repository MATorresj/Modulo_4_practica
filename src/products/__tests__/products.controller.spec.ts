import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from '../products.controller';
import { ProductsService } from '../products.service';
import { CreateProductDto } from '../dtos/createProduct.dto';
import { UpdateProductDto } from '../dtos/updateProduct.dto';
import { NotFoundException } from '@nestjs/common';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { UsersRepository } from '../../users/users.repository';
import { FilesService } from '../../files/files.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            getProducts: jest.fn(),
            getProductById: jest.fn(),
            createProduct: jest.fn(),
            updateProduct: jest.fn(),
            deleteProduct: jest.fn()
          }
        },
        {
          provide: UsersRepository,
          useValue: {} // Simulación de UsersRepository para evitar dependencias
        },
        {
          provide: FilesService,
          useValue: {} // Mock para evitar dependencias si es necesario
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) }) // Mock del guard para evitar errores de dependencia
      .compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  describe('getProducts', () => {
    it('debería retornar los productos', async () => {
      const result = {
        products: [
          {
            id: '1',
            name: 'Product 1',
            price: 100,
            description: 'Description 1',
            stock: 10,
            imgUrl: 'http://example.com/image.jpg',
            categoryId: '1',
            category: { id: '1', name: 'Category 1', products: [] },
            orderDetails: []
          }
        ],
        total: 1
      };
      jest.spyOn(service, 'getProducts').mockResolvedValue(result);

      expect(await controller.getProducts(1, 5)).toBe(result);
    });
  });

  describe('getProductById', () => {
    it('debería retornar un producto por ID', async () => {
      const product = {
        id: '1',
        name: 'Product 1',
        price: 100,
        description: 'Description 1',
        stock: 10,
        imgUrl: 'http://example.com/image.jpg',
        categoryId: '1',
        category: { id: '1', name: 'Category 1', products: [] },
        orderDetails: []
      };
      jest.spyOn(service, 'getProductById').mockResolvedValue(product);

      expect(await controller.getProductsById({ id: '1' })).toBe(product);
    });

    it('debería lanzar NotFoundException si el producto no se encuentra', async () => {
      jest
        .spyOn(service, 'getProductById')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.getProductsById({ id: '1' })).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('createProduct', () => {
    it('debería crear un producto', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
        imgUrl: 'http://example.com/image.jpg',
        categoryId: '1'
      };
      const createdProduct = {
        id: '1',
        ...createProductDto,
        category: { id: '1', name: 'Category 1', products: [] }, // Asegúrate de que este campo esté presente
        orderDetails: []
      };

      jest.spyOn(service, 'createProduct').mockResolvedValue(createdProduct);

      expect(await controller.createProduct(createProductDto)).toEqual(
        createdProduct
      );
    });
  });

  describe('updateProduct', () => {
    it('debería actualizar un producto', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      const existingProduct = {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        price: 100,
        stock: 10,
        imgUrl: 'http://example.com/image.jpg',
        categoryId: '1',
        category: { id: '1', name: 'Category 1', products: [] },
        orderDetails: []
      };
      const updatedProduct = {
        ...existingProduct,
        ...updateProductDto
      };

      jest.spyOn(service, 'updateProduct').mockResolvedValue(updatedProduct);

      expect(
        await controller.updateProduct({ id: '1' }, updateProductDto)
      ).toEqual({
        message: 'Producto actualizado con éxito',
        updatedProduct
      });
    });

    it('debería lanzar NotFoundException si el producto no se encuentra', async () => {
      const updateProductDto: UpdateProductDto = { name: 'Updated Product' };
      jest
        .spyOn(service, 'updateProduct')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.updateProduct({ id: '1' }, updateProductDto)
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteProduct', () => {
    it('debería eliminar un producto', async () => {
      const product = {
        id: '1',
        name: 'Product 1',
        price: 100,
        description: 'Description 1',
        stock: 10,
        imgUrl: 'http://example.com/image.jpg',
        categoryId: '1',
        category: { id: '1', name: 'Category 1', products: [] },
        orderDetails: []
      };
      jest.spyOn(service, 'deleteProduct').mockResolvedValue(product);

      expect(await controller.deleteProduct({ id: '1' })).toEqual({
        message: 'Producto eliminado con éxito',
        deletedProduct: product
      });
    });

    it('debería lanzar NotFoundException si el producto no se encuentra', async () => {
      jest
        .spyOn(service, 'deleteProduct')
        .mockRejectedValue(new NotFoundException());

      await expect(controller.deleteProduct({ id: '1' })).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
