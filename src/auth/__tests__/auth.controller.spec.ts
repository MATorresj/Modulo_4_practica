import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { CreateUserDto } from '../../users/dtos/createUser.dto';
import { LoginDto } from '../dto/login.dto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  const mockAuthService = {
    signup: jest.fn(),
    signin: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }]
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  describe('signup', () => {
    it('debería crear un nuevo usuario y devolverlo', async () => {
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

      mockAuthService.signup.mockResolvedValue({
        email: 'aa@gmail.com',
        name: 'Test User',
        address: '123 calle',
        phone: '1234567890',
        country: 'Colombia',
        city: 'Medellin',
        isAdmin: false
      });

      const result = await authController.signup(createUserDto);

      expect(result).toEqual({
        email: 'aa@gmail.com',
        name: 'Test User',
        address: '123 calle',
        phone: '1234567890',
        country: 'Colombia',
        city: 'Medellin'
      });
      expect(mockAuthService.signup).toHaveBeenCalledWith(createUserDto);
    });

    it('debería lanzar BadRequestException si las contraseñas no coinciden', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'Hola123!',
        confirmPassword: 'differentPassword',
        name: 'Test User',
        address: 'calle falsa 1',
        phone: '3123123123',
        country: 'Colombia',
        city: 'Medellin'
      };
      await expect(authController.signup(createUserDto)).rejects.toThrow(
        BadRequestException
      );
      expect(mockAuthService.signup).not.toHaveBeenCalled();
    });
  });

  describe('signin', () => {
    it('debería devolver un accessToken al iniciar sesión correctamente', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password'
      };

      const result = { accessToken: 'mockAccessToken' };
      mockAuthService.signin.mockResolvedValue(result);

      const response = await authController.signin(loginDto);

      expect(response).toEqual(result);
      expect(mockAuthService.signin).toHaveBeenCalledWith(loginDto);
    });

    it('debería lanzar UnauthorizedException si las credenciales son incorrectas', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongPassword'
      };

      mockAuthService.signin.mockRejectedValue(
        new UnauthorizedException('Email o contraseña incorrectos')
      );

      await expect(authController.signin(loginDto)).rejects.toThrow(
        UnauthorizedException
      );
      await expect(authController.signin(loginDto)).rejects.toThrow(
        'Email o contraseña incorrectos'
      );
      expect(mockAuthService.signin).toHaveBeenCalledWith(loginDto);
    });
  });
});
