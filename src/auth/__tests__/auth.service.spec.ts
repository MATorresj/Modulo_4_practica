import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UsersRepository } from '../../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dtos/createUser.dto';
import { LoginDto } from '../dto/login.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockImplementation(() => {
    return Promise.resolve('$2b$10$fixedHashForTest');
  }),
  compare: jest.fn().mockImplementation((password) => {
    if (password === 'password') {
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  })
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepositoryMock: Partial<UsersRepository>;
  let jwtServiceMock: Partial<JwtService>;

  beforeEach(async () => {
    usersRepositoryMock = {
      createUser: jest.fn(),
      findByEmail: jest.fn()
    };

    jwtServiceMock = {
      sign: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useValue: usersRepositoryMock },
        { provide: JwtService, useValue: jwtServiceMock }
      ]
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('debería crear un nuevo usuario y devolverlo correctamente', async () => {
      const createUserDto: CreateUserDto = {
        email: 'aa@gmail.com',
        password: 'Hola123!',
        confirmPassword: 'Hola123!',
        name: 'Test User',
        address: '123 calle',
        phone: '1234567890',
        country: 'Colombia',
        city: 'Medellin'
      };

      usersRepositoryMock.createUser = jest.fn().mockResolvedValue({
        id: '0b473bf0-c7c2-4afb-a303-ce7d6ee655f9',
        email: createUserDto.email,
        name: createUserDto.name,
        address: createUserDto.address,
        phone: createUserDto.phone,
        country: createUserDto.country,
        city: createUserDto.city,
        orders: [],
        password: '$2b$10$fixedHashForTest'
      });

      const result = await authService.signup(createUserDto);
      expect(result).toEqual({
        id: '0b473bf0-c7c2-4afb-a303-ce7d6ee655f9',
        email: 'aa@gmail.com',
        name: 'Test User',
        address: '123 calle',
        phone: '1234567890',
        country: 'Colombia',
        city: 'Medellin',
        orders: []
      });

      expect(usersRepositoryMock.createUser).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: '$2b$10$fixedHashForTest',
        name: createUserDto.name,
        address: createUserDto.address,
        phone: createUserDto.phone,
        country: createUserDto.country,
        city: createUserDto.city,
        orders: [],
        isAdmin: false
      });
    });

    it('debería lanzar BadRequestException si las contraseñas no coinciden', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'differentPassword',
        name: 'Test User',
        address: 'calle falsa 1',
        phone: '3123123123',
        country: 'Colombia',
        city: 'Medellin'
      };

      await expect(authService.signup(createUserDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('signin', () => {
    it('debería devolver un accessToken al iniciar sesión correctamente', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password'
      };

      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        isAdmin: false
      };

      usersRepositoryMock.findByEmail = jest.fn().mockResolvedValue(user);
      jwtServiceMock.sign = jest.fn().mockReturnValue('mockAccessToken');

      const result = await authService.signin(loginDto);

      expect(result).toEqual({ accessToken: 'mockAccessToken' });
      expect(usersRepositoryMock.findByEmail).toHaveBeenCalledWith(
        loginDto.email
      );
      expect(jwtServiceMock.sign).toHaveBeenCalledWith(
        {
          email: user.email,
          sub: user.id,
          isAdmin: user.isAdmin
        },
        { expiresIn: '1h' }
      );
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password'
      };

      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('differentPassword', 10)
      };

      usersRepositoryMock.findByEmail = jest.fn().mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockImplementation(() => {
        return Promise.resolve(false);
      });

      await expect(authService.signin(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(authService.signin(loginDto)).rejects.toThrow(
        'Email o contraseña incorrectos'
      );
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password'
      };

      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('wrongPassword', 10)
      };

      usersRepositoryMock.findByEmail = jest.fn().mockResolvedValue(user);

      await expect(authService.signin(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
