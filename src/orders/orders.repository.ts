import { Injectable } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderDetails)
    private readonly orderDetailsRepository: Repository<OrderDetails>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async getOrderById(id: string): Promise<Order> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['orderDetails', 'orderDetails.products']
    });
  }

  async addOrder(userId: string, productIds: string[]): Promise<Order> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const products = await this.productRepository.find({
      where: { id: In(productIds) }
    });
    if (!products || products.length === 0) {
      throw new Error('Products not found');
    }

    const availableProducts = products.filter((product) => product.stock > 0);

    if (availableProducts.length === 0) {
      throw new Error('No products with available stock');
    }

    let total = 0;
    for (const product of availableProducts) {
      const productPrice = Number(product.price);

      if (isNaN(productPrice) || productPrice <= 0) {
        throw new Error(`Invalid price for product ${product.id}`);
      }

      total += productPrice;

      product.stock -= 1;
      await this.productRepository.save(product);
    }

    const order = this.orderRepository.create({
      date: new Date(),
      user
    });

    const savedOrder = await this.orderRepository.save(order);

    const orderDetails = this.orderDetailsRepository.create({
      price: total,
      order: savedOrder,
      products: availableProducts
    });

    await this.orderDetailsRepository.save(orderDetails);

    savedOrder.orderDetails = orderDetails;
    await this.orderRepository.save(savedOrder);

    return savedOrder;
  }
}
