import { Injectable } from '@nestjs/common';
import { OrdersRepository } from './orders.repository';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async getOrderById(id: string) {
    return await this.ordersRepository.getOrderById(id);
  }

  async createOrder(
    userId: string,
    productIds: string[]
  ): Promise<OrderResponseDto> {
    const order = await this.ordersRepository.addOrder(userId, productIds);
    return {
      orderId: order.id,
      date: order.date,
      userId: order.user.id,
      orderDetails: {
        price: order.orderDetails.price,
        products: order.orderDetails.products
      }
    };
  }
}
