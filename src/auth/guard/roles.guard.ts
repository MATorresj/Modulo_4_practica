import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersRepository } from '../../users/users.repository';
import { UserRole } from '../../users/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersRepository: UsersRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
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

    if (roles.includes(UserRole.Admin) && !isAdmin) {
      throw new ForbiddenException('Acceso denegado: No eres administrador');
    }

    return true;
  }
}
