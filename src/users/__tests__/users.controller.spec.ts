import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import {
  NotFoundException,
  InternalServerErrorException
} from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUsers = [
    {
      id: '1',
      name: 'Usuario 1',
      email: 'usuario1@example.com',
      password: 'hashed_password',
      phone: '123456789',
      country: 'Argentina',
      address: 'Dirección 123',
      city: 'Buenos Aires',
      isAdmin: false,
      orders: []
    },
    {
      id: '2',
      name: 'Usuario 2',
      email: 'usuario2@example.com',
      password: 'hashed_password',
      phone: '987654321',
      country: 'Argentina',
      address: 'Dirección 456',
      city: 'Córdoba',
      isAdmin: false,
      orders: []
    }
  ];

  const mockUser = {
    id: '1',
    name: 'Usuario Prueba',
    email: 'prueba@example.com',
    password: 'hashed_password',
    phone: '123456789',
    country: 'Argentina',
    address: 'Dirección 123',
    city: 'Buenos Aires',
    isAdmin: true,
    orders: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn(),
            getUsersById: jest.fn(),
            createUser: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn()
          }
        }
      ]
    })
      .overrideGuard(AuthGuard)
      .useValue({})
      .overrideGuard(RolesGuard)
      .useValue({})
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  describe('getUsers', () => {
    it('debería devolver una lista de usuarios', async () => {
      usersService.getUsers.mockResolvedValue(mockUsers);

      const result = await usersController.getUsers(1, 5);

      expect(usersService.getUsers).toHaveBeenCalledWith(1, 5);
      expect(result).toEqual(mockUsers);
    });

    it('debería manejar errores y lanzar InternalServerErrorException', async () => {
      usersService.getUsers.mockRejectedValue(new Error('Error interno'));

      await expect(usersController.getUsers(1, 5)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('getUsersById', () => {
    it('debería devolver un usuario por ID', async () => {
      usersService.getUsersById.mockResolvedValue(mockUser);

      const result = await usersController.getUsersById({ id: '1' });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isAdmin, ...userWithoutAdmin } = mockUser;
      expect(usersService.getUsersById).toHaveBeenCalledWith('1');
      expect(result).toEqual(userWithoutAdmin);
    });

    it('debería lanzar NotFoundException si el usuario no se encuentra', async () => {
      usersService.getUsersById.mockResolvedValue(undefined);

      await expect(usersController.getUsersById({ id: '999' })).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateUser', () => {
    it('debería actualizar un usuario existente', async () => {
      const updateUserDto = { name: 'Updated Name' };
      const updatedUser = { ...mockUser, name: 'Updated Name' };

      usersService.updateUser.mockResolvedValue({
        message: 'Usuario actualizado con éxito',
        user: updatedUser
      });

      const result = await usersController.updateUser(
        { id: '1' },
        updateUserDto
      );

      const userWithoutAdmin = {
        ...updatedUser,
        isAdmin: undefined,
        password: undefined
      };
      expect(result).toEqual({
        message: 'Usuario actualizado con éxito',
        user: userWithoutAdmin
      });
    });

    it('debería lanzar NotFoundException si el usuario no se encuentra', async () => {
      usersService.updateUser.mockResolvedValue(undefined);

      await expect(
        usersController.updateUser({ id: '999' }, { name: 'New Name' })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('debería eliminar un usuario existente', async () => {
      usersService.deleteUser.mockResolvedValue({
        message: 'Usuario eliminado con éxito',
        user: mockUser
      });

      const result = await usersController.deleteUser({ id: '1' });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, isAdmin, ...userWithoutAdminAndPassword } = mockUser;
      expect(usersService.deleteUser).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        message: 'Usuario eliminado con éxito',
        user: userWithoutAdminAndPassword
      });
    });

    it('debería lanzar NotFoundException si el usuario no se encuentra', async () => {
      usersService.deleteUser.mockResolvedValue(undefined);

      await expect(usersController.deleteUser({ id: '999' })).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
