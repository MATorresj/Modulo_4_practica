import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersRepository } from './orders.repository';
import { Order } from './entities/order.entity';
import { OrderDetails } from './entities/orderDetails.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderDetails, Product, User]),
    UsersModule
  ],
  providers: [OrdersService, OrdersRepository],
  controllers: [OrdersController]
})
export class OrderModule {}
