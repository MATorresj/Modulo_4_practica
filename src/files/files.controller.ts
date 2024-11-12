import {
  Controller,
  Post,
  Param,
  UploadedFile,
  UseInterceptors,
  ParseUUIDPipe,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  InternalServerErrorException
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { ProductsService } from '../products/products.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly productsService: ProductsService
  ) {}

  @ApiBearerAuth()
  @Post('uploadImage/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 200000 }),
          new FileTypeValidator({ fileType: /jpeg|jpg|png|webp/ })
        ]
      })
    )
    file: Express.Multer.File
  ) {
    try {
      return await this.productsService.updateProductImage(id, file);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar la imagen: ${error.message}`
      );
    }
  }
}
