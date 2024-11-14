import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  NotFoundException,
  UseGuards
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ValidateIdDto } from './dto/validateId.dto';
import { CreateOrderDto } from './dto/createOrder.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { OrderResponseDto } from './dto/order-response.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(AuthGuard)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto
  ): Promise<OrderResponseDto> {
    try {
      const { userId, products } = createOrderDto;
      const productIds = products.map((product) => product.id);
      return await this.ordersService.createOrder(userId, productIds);
    } catch (error) {
      throw new NotFoundException(`Error al crear la orden: ${error.message}`);
    }
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrder(@Param() params: ValidateIdDto) {
    try {
      const order = await this.ordersService.getOrderById(params.id);
      if (!order) {
        throw new NotFoundException('No se encontró la orden');
      }
      return order;
    } catch (error) {
      throw new NotFoundException(`No se encontró la orden: ${error}`);
    }
  }
}
