import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  private generateUUID(): string {
    return uuid();
  }

  async getUsers(page: number, limit: number): Promise<User[]> {
    const users = await this.userRepository.find({
      skip: (page - 1) * limit,
      take: limit,
      relations: ['orders']
    });
    return users;
  }

  async getById(id: string): Promise<User | undefined> {
    console.log('Finding user with id:', id);
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['orders']
    });

    if (user) {
      const simplifiedOrders = user.orders.map((order) => ({
        id: order.id,
        date: order.date
      }));

      user.orders = simplifiedOrders as any;

      return user;
    }

    return undefined;
  }

  async deleteUser(id: string): Promise<{ message: string; user?: User }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      await this.userRepository.remove(user);
      return { message: 'Usuario eliminado con éxito', user };
    }
    return { message: 'Usuario no encontrado' };
  }

  async updateUser(
    id: string,
    updateUserDto: Partial<User>
  ): Promise<{ message: string; user?: User }> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (user) {
      const updatedUser = { ...user, ...updateUserDto };
      await this.userRepository.save(updatedUser);
      return { message: 'Usuario actualizado con éxito', user: updatedUser };
    }
    return { message: 'Usuario no encontrado' };
  }

  async createUser(createUserDto: Omit<User, 'id'>): Promise<User> {
    const newId = this.generateUUID();
    const newUser: User = { id: newId, ...createUserDto };
    return await this.userRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }
}
