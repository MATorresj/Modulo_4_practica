import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';
import { UsersDbService } from '../usersDb.service';
import { User } from '../entities/user.entity';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: jest.Mocked<UsersRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            getUsers: jest.fn(),
            getById: jest.fn(),
            deleteUser: jest.fn(),
            updateUser: jest.fn()
          }
        },
        {
          provide: UsersDbService,
          useValue: {
            saveUser: jest.fn()
          }
        }
      ]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get(UsersRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver una lista de usuarios', async () => {
    const page = 1;
    const limit = 10;
    const mockUsers = [
      { id: '1', name: 'Juan', email: 'juan@example.com' } as User,
      { id: '2', name: 'Ana', email: 'ana@example.com' } as User
    ];

    usersRepository.getUsers.mockResolvedValue(mockUsers);

    const result = await usersService.getUsers(page, limit);

    expect(usersRepository.getUsers).toHaveBeenCalledWith(page, limit);
    expect(result).toEqual(mockUsers);
  });

  it('debería devolver un usuario por id', async () => {
    const mockUser = {
      id: '1',
      name: 'Juan',
      email: 'juan@example.com'
    } as User;
    usersRepository.getById.mockResolvedValue(mockUser);

    const result = await usersService.getUsersById('1');

    expect(usersRepository.getById).toHaveBeenCalledWith('1');
    expect(result).toEqual(mockUser);
  });

  it('debería devolver undefined si no se encuentra el usuario', async () => {
    usersRepository.getById.mockResolvedValue(undefined);

    const result = await usersService.getUsersById('999');

    expect(usersRepository.getById).toHaveBeenCalledWith('999');
    expect(result).toBeUndefined();
  });

  it('debería actualizar un usuario existente', async () => {
    const updateUserDto = { name: 'Updated Name' };
    const mockUser = { id: '1', ...updateUserDto } as User;

    usersRepository.updateUser.mockResolvedValue({
      message: 'Usuario actualizado con éxito',
      user: mockUser
    });

    const result = await usersService.updateUser('1', updateUserDto);

    expect(usersRepository.updateUser).toHaveBeenCalledWith('1', updateUserDto);
    expect(result).toEqual({
      message: 'Usuario actualizado con éxito',
      user: mockUser
    });
  });

  it('debería eliminar un usuario existente', async () => {
    const mockUser = { id: '1', name: 'Test User' } as User;

    usersRepository.deleteUser.mockResolvedValue({
      message: 'Usuario eliminado con éxito',
      user: mockUser
    });

    const result = await usersService.deleteUser('1');

    expect(usersRepository.deleteUser).toHaveBeenCalledWith('1');
    expect(result).toEqual({
      message: 'Usuario eliminado con éxito',
      user: mockUser
    });
  });
});
