import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { CreateProductDto } from './dtos/createProduct.dto';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) {}
  async getProducts(page: number, limit: number) {
    const [products, total] = await this.productRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit
    });
    return { products, total };
  }

  async getById(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }

  async getByName(name: string) {
    return this.productRepository.findOne({ where: { name } });
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) return null;
    await this.productRepository.remove(product);
    return product;
  }

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    Object.assign(product, updateProductDto);
    return await this.productRepository.save(product);
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const newProduct = this.productRepository.create({
      ...createProductDto,
      id: uuid(),
      orderDetails: []
    });
    return await this.productRepository.save(newProduct);
  }
}
