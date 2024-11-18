import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UsersDbService } from './usersDb.service';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private usersDbService: UsersDbService
  ) {}

  getUsers(page: number, limit: number) {
    console.log('Parametros de paginación:', { page, limit });
    return this.usersRepository.getUsers(page, limit);
  }

  getUsersById(id: string): Promise<User | undefined> {
    return this.usersRepository.getById(id);
  }

  deleteUser(id: string): Promise<{ message: string; user?: User }> {
    return this.usersRepository.deleteUser(id);
  }

  updateUser(
    id: string,
    updateUserDto: UpdateUserDto
  ): Promise<{ message: string; user?: User }> {
    return this.usersRepository.updateUser(id, updateUserDto);
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userData = { ...createUserDto, orders: [], isAdmin: false };
    const newUser = await this.usersRepository.createUser(userData);

    await this.usersDbService.saveUser(newUser);

    return newUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findByEmail(email);
  }

  async makeAdmin(userId: string): Promise<User> {
    const user = await this.usersRepository.getById(userId);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    user.isAdmin = true;
    await this.usersRepository.updateUser(userId, user);
    return user;
  }
}
