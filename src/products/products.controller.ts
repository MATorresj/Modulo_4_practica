import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dtos/createProduct.dto';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ValidateIdDto } from './dtos/validateId.dto';
import { FilesService } from '../files/files.service';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from '../users/user-role.enum';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly filesService: FilesService
  ) {}

  @Get()
  async getProducts(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5
  ) {
    try {
      return await this.productsService.getProducts(page, limit);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener productos: ${error}`
      );
    }
  }

  @Get(':id')
  async getProductsById(@Param() params: ValidateIdDto) {
    try {
      const product = await this.productsService.getProductById(params.id);
      if (!product || product === undefined) {
        throw new NotFoundException(
          `Producto con ID ${params.id} no encontrado.`
        );
      }
      return product;
    } catch (error) {
      throw new NotFoundException(`Error al obtener producto: ${error}`);
    }
  }

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() createProductDto: CreateProductDto) {
    try {
      const newProduct =
        await this.productsService.createProduct(createProductDto);
      return newProduct;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear producto: ${error}`
      );
    }
  }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async updateProduct(
    @Param() params: ValidateIdDto,
    @Body() updateProductDto: UpdateProductDto
  ) {
    try {
      const updatedProduct = await this.productsService.updateProduct(
        params.id,
        updateProductDto
      );
      return { message: 'Producto actualizado con éxito', updatedProduct };
    } catch (error) {
      throw new NotFoundException(
        `No se encontró el producto para actualizar: ${error}`
      );
    }
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param() params: ValidateIdDto) {
    try {
      const deletedProduct = await this.productsService.deleteProduct(
        params.id
      );
      return { message: 'Producto eliminado con éxito', deletedProduct };
    } catch (error) {
      throw new NotFoundException(
        `No se encontró el producto para eliminar: ${error}`
      );
    }
  }

  @Post('seeder')
  async seedProducts() {
    try {
      const seededProducts = await this.productsService.seedProducts();
      return seededProducts;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al hacer el seed de productos: ${error}`
      );
    }
  }
}
