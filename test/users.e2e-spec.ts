import { Test, TestingModule } from '@nestjs/testing';
import {
  ForbiddenException,
  INestApplication,
  UnauthorizedException
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';
import { hash } from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { UsersRepository } from '../src/users/users.repository';
import { UsersController } from '../src/users/users.controller';
import { AuthGuard } from '../src/auth/guard/auth.guard';
import { UsersDbService } from '../src/users/usersDb.service';
import { RolesGuard } from '../src/auth/guard/roles.guard';
import { AuthService } from '../src/auth/auth.service';

describe('Users E2E', () => {
  let app: INestApplication;
  let usersService: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;
  let authToken: string;

  const mockRolesGuard = {
    canActivate: jest.fn(async (context) => {
      const request = context.switchToHttp().getRequest();
      const user = request.user;

      if (user.isAdmin === false) {
        throw new ForbiddenException('Acceso denegado: No eres administrador');
      }

      return true;
    })
  };

  const mockUsersRepository = {
    getUsers: jest.fn().mockImplementation(() => {
      console.log('Mock getUsers llamado');
      return Promise.resolve([
        { email: 'user1@gmail.com', isAdmin: true },
        { email: 'user2@gmail.com', isAdmin: true }
      ]);
    }),
    getById: jest.fn().mockResolvedValue({
      email: 'prueba@gmail.com',
      isAdmin: true
    }),
    updateUser: jest.fn(),
    deleteUser: jest.fn().mockResolvedValue({
      message: 'Usuario eliminado con éxito',
      user: {
        name: 'prueba',
        email: '1@gmail.com',
        password: '12345',
        phone: '3052615539',
        country: 'Colombia',
        address: 'calle falsa 1234',
        city: 'medellin'
      }
    })
  };

  const mockAuthService = {
    signin: jest.fn().mockImplementation(async (email, password) => {
      if (email === 'prueba@gmail.com' && password === 'Hola123!') {
        return { accessToken: 'token-fake' };
      }
      throw new UnauthorizedException();
    })
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUsersRepository
        },
        {
          provide: UsersDbService,
          useValue: {}
        },
        {
          provide: AuthService,
          useValue: mockAuthService
        },
        {
          provide: AuthGuard,
          useValue: { canActivate: jest.fn().mockReturnValue(true) }
        },
        {
          provide: RolesGuard,
          useClass: RolesGuard
        }
      ]
    })
      .overrideGuard(RolesGuard)
      .useValue(mockRolesGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    app.useLogger(['log', 'error', 'warn', 'debug']);

    usersService = moduleFixture.get<UsersService>(UsersService);
    authService = moduleFixture.get<AuthService>(AuthService);
    const hashedPassword = await hash('Hola123!', 10);

    jest
      .spyOn(usersService, 'findByEmail')
      .mockImplementation(async (email) => {
        const users = {
          'prueba@gmail.com': {
            email: 'prueba@gmail.com',
            password: hashedPassword,
            isAdmin: true
          },
          'isadmin@gmail.com': {
            email: 'isadmin@gmail.com',
            password: hashedPassword,
            isAdmin: false
          }
        };
        return users[email] || undefined;
      });

    jest.spyOn(usersService, 'getUsers').mockImplementation(async () => {
      return Promise.resolve([
        {
          email: 'prueba@gmail.com',
          isAdmin: true
        }
      ] as User[]);
    });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'prueba@gmail.com', password: 'Hola123!' });
    console.log('Login Response:', loginResponse.body);
    authToken = loginResponse.body.accessToken;
    if (!authToken) {
      console.error('No se pudo obtener un token de autenticación.');
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /users', async () => {
    const req = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);

    console.log('REVISAR TOKEN', authToken);
    console.log('Request Response:', req.body);

    expect(req.status).toBe(200);
    expect(req.body).toBeInstanceOf(Array);
  });

  it('GET /users - Paginación', async () => {
    mockUsersRepository.getUsers.mockResolvedValueOnce([
      { email: 'user1@gmail.com', isAdmin: true },
      { email: 'user2@gmail.com', isAdmin: true }
    ]);

    const req = await request(app.getHttpServer())
      .get('/users?page=1&limit=2')
      .set('Authorization', `Bearer ${authToken}`);

    console.log('REVISAR TOKEN', authToken);
    console.log('Request Response:', req.body);

    expect(req.status).toBe(200);
    expect(req.body).toHaveLength(2);
  });

  it('GET /users - sin token (debe devolver 401)', async () => {
    const req = await request(app.getHttpServer()).get('/users');
    console.log(req.body);
    expect(req.status).toBe(401);
    expect(req.body).toEqual({
      message: 'No se ha encontrado el header de autenticación',
      error: 'Unauthorized',
      statusCode: 401
    });
  });

  it('GET /users para no admin', async () => {
    const loginResponseNoAdmin = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email: 'isadmin@gmail.com', password: 'Hola123!' });
    console.log('Login Response NO ADMIN:', loginResponseNoAdmin.body);
    const authTokenNoAdmin = loginResponseNoAdmin.body.accessToken;

    mockUsersRepository.getUsers.mockResolvedValueOnce([
      { email: 'isadmin@gmail.com', isAdmin: false }
    ]);

    const req = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authTokenNoAdmin}`);

    console.log('REVISAR TOKEN NO ADMIN', authTokenNoAdmin);
    console.log('Request Response NO ADMIN:', req.body);

    expect(req.status).toBe(403);
    expect(req.body).toEqual({
      message: 'Acceso denegado: No eres administrador',
      error: 'Forbidden',
      statusCode: 403
    });
  });

  it('GET /users/:id con un usuario existente y token válido', async () => {
    const userId = 'e9d8e39c-b550-4e01-b33d-e46186e32811';
    mockUsersRepository.getById.mockResolvedValueOnce({
      id: userId,
      name: 'Test User',
      email: 'prueba@gmail.com',
      phone: '1234567890',
      country: 'Colombia',
      address: '123 calle',
      city: 'Medellin',
      orders: [
        {
          id: '8f184844-9397-47af-bf00-486895cff64a',
          date: '2024-10-30T02:55:45.252Z'
        },
        {
          id: 'e4ca57a3-cf61-4e76-9f84-985d2bfe9e7b',
          date: '2024-10-30T15:37:16.468Z'
        }
      ]
    });

    const req = await request(app.getHttpServer())
      .get(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(req.status).toBe(200);
    expect(req.body).toEqual({
      id: userId,
      name: 'Test User',
      email: 'prueba@gmail.com',
      phone: '1234567890',
      country: 'Colombia',
      address: '123 calle',
      city: 'Medellin',
      orders: [
        {
          id: '8f184844-9397-47af-bf00-486895cff64a',
          date: '2024-10-30T02:55:45.252Z'
        },
        {
          id: 'e4ca57a3-cf61-4e76-9f84-985d2bfe9e7b',
          date: '2024-10-30T15:37:16.468Z'
        }
      ]
    });
  });

  it('PUT /users/:id - actualiza el usuario con éxito', async () => {
    const userId = 'a3012bab-7410-4379-9aa4-c5d31c82a145';
    const updatedUserData = { name: 'holaaaaa' };

    mockUsersRepository.updateUser.mockResolvedValueOnce({
      message: 'Usuario actualizado con éxito',
      user: {
        id: userId,
        name: 'holaaaaa',
        email: 'isadmin@gmail.com',
        phone: '1234567890',
        country: 'Colombia',
        address: '123 calle',
        city: 'Medellin'
      }
    });

    const req = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updatedUserData);

    expect(req.status).toBe(200);
    expect(req.body).toEqual({
      message: 'Usuario actualizado con éxito',
      user: {
        id: userId,
        name: 'holaaaaa',
        email: 'isadmin@gmail.com',
        phone: '1234567890',
        country: 'Colombia',
        address: '123 calle',
        city: 'Medellin'
      }
    });
  });

  it('DELETE /users/:id - elimina el usuario con éxito', async () => {
    const userId = 'a29cc43c-d624-473d-bb3f-91628b235254';

    mockUsersRepository.deleteUser.mockResolvedValueOnce({
      message: 'Usuario eliminado con éxito',
      user: {
        name: 'prueba',
        email: '1@gmail.com',
        password: '12345',
        phone: '3052615539',
        country: 'Colombia',
        address: 'calle falsa 1234',
        city: 'medellin'
      }
    });

    const req = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(req.status).toBe(200);
    expect(req.body).toEqual({
      message: 'Usuario eliminado con éxito',
      user: {
        name: 'prueba',
        email: '1@gmail.com',
        password: '12345',
        phone: '3052615539',
        country: 'Colombia',
        address: 'calle falsa 1234',
        city: 'medellin'
      }
    });
  });
});
