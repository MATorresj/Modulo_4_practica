import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersRepository } from '../../users/users.repository';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersRepository: UsersRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userEntity = await this.usersRepository.getById(user.sub);

    if (!userEntity) {
      throw new ForbiddenException('Usuario no encontrado');
    }

    const isAdmin = userEntity.isAdmin;

    if (roles.includes('admin') && !isAdmin) {
      throw new ForbiddenException('Acceso denegado: No eres administrador');
    }

    return true;
  }
}
