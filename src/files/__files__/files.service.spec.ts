import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from '../files.service';
import { UploadApiResponse, v2 as Cloudinary } from 'cloudinary';
import * as stream from 'stream';

describe('FilesService', () => {
  let service: FilesService;
  let cloudinaryMock: Partial<typeof Cloudinary>;

  beforeEach(async () => {
    cloudinaryMock = {
      uploader: {
        upload_stream: jest.fn()
      } as any
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: 'CLOUDINARY',
          useValue: cloudinaryMock
        }
      ]
    }).compile();

    service = module.get<FilesService>(FilesService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('uploadImage', () => {
    it('debe subir la imagen correctamente y retornar el resultado', async () => {
      const mockResponse: UploadApiResponse = {
        secure_url: 'http://example.com/image.jpg'
      } as UploadApiResponse;
      const mockFile = {
        buffer: Buffer.from('file data')
      } as Express.Multer.File;

      (cloudinaryMock.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(null, mockResponse);
          return new stream.PassThrough();
        }
      );

      const result = await service.uploadImage(mockFile);
      expect(result).toEqual(mockResponse);
      expect(cloudinaryMock.uploader.upload_stream).toHaveBeenCalled();
    });

    it('debe lanzar un error si la carga falla', async () => {
      const mockFile = {
        buffer: Buffer.from('file data')
      } as Express.Multer.File;

      (cloudinaryMock.uploader.upload_stream as jest.Mock).mockImplementation(
        (options, callback) => {
          callback(new Error('Error de carga'), null);
          return new stream.PassThrough();
        }
      );

      await expect(service.uploadImage(mockFile)).rejects.toThrow(
        'Error de carga'
      );
    });
  });
});
