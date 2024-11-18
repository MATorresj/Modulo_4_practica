import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dtos/createProduct.dto';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { CategoriesService } from '../categories/categories.service';
import * as productsData from './arrayProducts.json';
import { Product } from './entities/product.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesService: CategoriesService,
    private readonly filesService: FilesService
  ) {}

  getProducts(page: number, limit: number) {
    return this.productsRepository.getProducts(page, limit);
  }

  getProductById(id: string) {
    return this.productsRepository.getById(id);
  }

  deleteProduct(id: string) {
    return this.productsRepository.deleteProduct(id);
  }

  updateProduct(id: string, updateProductDto: UpdateProductDto) {
    if (Object.keys(updateProductDto).length === 0) {
      throw new BadRequestException(
        'No se proporcionaron datos para actualizar'
      );
    }

    return this.productsRepository.updateProduct(id, updateProductDto);
  }

  async updateProductImage(
    id: string,
    file: Express.Multer.File
  ): Promise<Product> {
    const product = await this.productsRepository.getById(id);
    if (!product) {
      throw new NotFoundException('No se encontró el producto');
    }
    const uploadResult = await this.filesService.uploadImage(file);
    return this.productsRepository.updateProduct(id, {
      imgUrl: uploadResult.secure_url
    });
  }

  async createProduct(createProductDto: CreateProductDto) {
    const newProduct =
      await this.productsRepository.createProduct(createProductDto);

    return newProduct;
  }

  async seedProducts() {
    const products = productsData;

    const insertedProducts = [];
    const alreadyInserted = [];

    for (const product of products) {
      const category = await this.categoriesService.getCategories();
      const productCategory = category.find(
        (cat) => cat.name === product.category
      );

      if (productCategory) {
        const existingProduct = await this.productsRepository.getByName(
          product.name
        );
        if (!existingProduct) {
          const newProduct = await this.productsRepository.createProduct({
            ...product,
            categoryId: String(productCategory.id),
            imgUrl:
              'https://images.vexels.com/media/users/3/199820/isolated/preview/892bfdfcb80b356c53405aafbb716513-caja-de-carton-isometrica.png'
          });
          insertedProducts.push(newProduct);
        } else {
          alreadyInserted.push(product.name);
        }
      } else {
        throw new BadRequestException(
          `Categoría ${product.category} no encontrada.`
        );
      }
    }
    if (insertedProducts.length === 0 && alreadyInserted.length > 0) {
      return {
        message: 'Todos los productos ya estaban en la base de datos.',
        productsAlreadyInserted: alreadyInserted
      };
    }
    return {
      message: 'Productos insertados correctamente.',
      productsInserted: insertedProducts.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        imgUrl: product.imgUrl,
        categoryId: product.categoryId
      })),
      productsAlreadyInserted: alreadyInserted
    };
  }
}
