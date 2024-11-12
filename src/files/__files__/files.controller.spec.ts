import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from '../files.controller';
import { FilesService } from '../files.service';
import { ProductsService } from '../../products/products.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { InternalServerErrorException } from '@nestjs/common';

describe('FilesController', () => {
  let controller: FilesController;
  let filesServiceMock: Partial<FilesService>;
  let productsServiceMock: Partial<ProductsService>;

  beforeEach(async () => {
    filesServiceMock = {};
    productsServiceMock = {
      updateProductImage: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [
        {
          provide: FilesService,
          useValue: filesServiceMock
        },
        {
          provide: ProductsService,
          useValue: productsServiceMock
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImage', () => {
    it('debe subir una imagen y retornar el resultado', async () => {
      const mockFile = {
        buffer: Buffer.from('file data')
      } as Express.Multer.File;
      const productId = 'product123';
      const mockResponse = { secure_url: 'http://example.com/image.jpg' };

      (productsServiceMock.updateProductImage as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const result = await controller.uploadImage(productId, mockFile);
      expect(result).toEqual(mockResponse);
      expect(productsServiceMock.updateProductImage).toHaveBeenCalledWith(
        productId,
        mockFile
      );
    });

    it('debe lanzar InternalServerErrorException si updateProductImage falla', async () => {
      const mockFile = {
        buffer: Buffer.from('file data')
      } as Express.Multer.File;
      const productId = 'product123';

      (productsServiceMock.updateProductImage as jest.Mock).mockRejectedValue(
        new Error('Error al actualizar la imagen')
      );

      await expect(controller.uploadImage(productId, mockFile)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
