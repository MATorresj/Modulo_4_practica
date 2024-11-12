import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders.service';
import { OrdersRepository } from '../orders.repository';
import { OrderResponseDto } from '../dto/order-response.dto';
import { Category } from '../../categories/category.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepositoryMock: Partial<OrdersRepository>;

  beforeEach(async () => {
    ordersRepositoryMock = {
      addOrder: jest.fn(),
      getOrderById: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: ordersRepositoryMock
        }
      ]
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe crear una nueva orden y retornar OrderResponseDto', async () => {
    const userId = 'user123';
    const productIds = ['product1', 'product2'];
    const mockOrderResponse: OrderResponseDto = {
      date: new Date(),
      userId,
      orderId: 'order123',
      orderDetails: {
        price: 200.0,
        products: [
          {
            id: 'product1',
            name: 'Producto 1',
            price: 100,
            description: '',
            stock: 5,
            imgUrl: '',
            categoryId: 'cat1',
            category: new Category(),
            orderDetails: []
          },
          {
            id: 'product2',
            name: 'Producto 2',
            price: 100,
            description: '',
            stock: 5,
            imgUrl: '',
            categoryId: 'cat2',
            category: new Category(),
            orderDetails: []
          }
        ]
      }
    };

    (ordersRepositoryMock.addOrder as jest.Mock).mockResolvedValue({
      id: 'order123',
      date: new Date(),
      user: { id: userId },
      orderDetails: {
        price: 200.0,
        products: mockOrderResponse.orderDetails.products
      }
    });

    const result = await service.createOrder(userId, productIds);

    expect(result).toEqual(mockOrderResponse);
    expect(ordersRepositoryMock.addOrder).toHaveBeenCalledWith(
      userId,
      productIds
    );
  });

  it('debe lanzar un error si addOrder falla', async () => {
    const userId = 'user123';
    const productIds = ['product1', 'product2'];

    (ordersRepositoryMock.addOrder as jest.Mock).mockRejectedValue(
      new Error('Error al crear orden')
    );

    await expect(service.createOrder(userId, productIds)).rejects.toThrow(
      'Error al crear orden'
    );
  });
  it('debe retornar una orden por su ID', async () => {
    const orderId = 'ae4bdeb2-daf1-43f0-9f92-9fcfa2c6862f';
    const mockOrder = {
      id: orderId,
      date: new Date('2024-10-15T22:25:19.105Z'),
      orderDetails: {
        id: '055d0d63-687d-43c1-8e0a-283ad4f19247',
        price: 349.99,
        products: [
          {
            id: '2877cf54-9598-4755-8b2a-519c9a174b40',
            name: 'Iphone 15',
            description: 'The best smartphone in the world',
            price: 999.99,
            stock: 11,
            imgUrl: 'https://via.placeholder.com/150',
            categoryId: '96411a7a-dfa6-40be-8ec7-77a1b76db655'
          },
          {
            id: '5e036df8-2c48-43fc-ab5a-610734949dfb',
            name: 'Samsung Galaxy S23',
            description: 'The best smartphone in the world',
            price: 999.99,
            stock: 11,
            imgUrl: 'https://via.placeholder.com/150',
            categoryId: '96411a7a-dfa6-40be-8ec7-77a1b76db655'
          }
        ]
      }
    };

    (ordersRepositoryMock.getOrderById as jest.Mock).mockResolvedValue(
      mockOrder
    );

    const result = await service.getOrderById(orderId);

    expect(result).toEqual(mockOrder);
    expect(ordersRepositoryMock.getOrderById).toHaveBeenCalledWith(orderId);
  });

  it('debe lanzar un error si getOrderById falla', async () => {
    const orderId = 'nonexistent-id';

    (ordersRepositoryMock.getOrderById as jest.Mock).mockRejectedValue(
      new Error('Orden no encontrada')
    );

    await expect(service.getOrderById(orderId)).rejects.toThrow(
      'Orden no encontrada'
    );
  });
});
