import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from '../orders.controller';
import { OrdersService } from '../orders.service';
import { OrderResponseDto } from '../dto/order-response.dto';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { AuthGuard } from '../../auth/guard/auth.guard';
import {
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { ValidateIdDto } from '../dto/validateId.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersServiceMock: Partial<OrdersService>;

  beforeEach(async () => {
    ordersServiceMock = {
      createOrder: jest.fn(),
      getOrderById: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: ordersServiceMock
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('getOrder', () => {
    it('debe retornar una orden si se encuentra', async () => {
      const mockOrder: OrderResponseDto = {
        date: new Date(),
        userId: 'user123',
        orderId: 'order123',
        orderDetails: {
          price: 200.0,
          products: []
        }
      };
      (ordersServiceMock.getOrderById as jest.Mock).mockResolvedValue(
        mockOrder
      );

      const params: ValidateIdDto = { id: 'order123' };
      const result = await controller.getOrder(params);

      expect(result).toEqual(mockOrder);
      expect(ordersServiceMock.getOrderById).toHaveBeenCalledWith('order123');
    });

    it('debe lanzar NotFoundException si la orden no se encuentra', async () => {
      (ordersServiceMock.getOrderById as jest.Mock).mockResolvedValue(null);

      const params: ValidateIdDto = { id: 'nonexistentId' };

      await expect(controller.getOrder(params)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('createOrder', () => {
    it('debe crear una nueva orden y retornar OrderResponseDto', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 'user123',
        products: [{ id: 'product1' }, { id: 'product2' }]
      };
      const mockResponse: OrderResponseDto = {
        date: new Date(),
        userId: 'user123',
        orderId: 'order123',
        orderDetails: {
          price: 200,
          products: []
        }
      };

      (ordersServiceMock.createOrder as jest.Mock).mockResolvedValue(
        mockResponse
      );

      const result = await controller.createOrder(createOrderDto);

      expect(result).toEqual(mockResponse);
      expect(ordersServiceMock.createOrder).toHaveBeenCalledWith('user123', [
        'product1',
        'product2'
      ]);
    });

    it('debe lanzar InternalServerErrorException si createOrder falla', async () => {
      const createOrderDto: CreateOrderDto = {
        userId: 'user123',
        products: [{ id: 'product1' }]
      };

      (ordersServiceMock.createOrder as jest.Mock).mockRejectedValue(
        new Error('Error al crear la orden')
      );

      await expect(controller.createOrder(createOrderDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
