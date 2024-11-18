import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common';
import { UsersRepository } from '../../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    console.log('Auth Header:', authHeader);

    if (!authHeader) {
      throw new UnauthorizedException(
        'No se ha encontrado el header de autenticación'
      );
    }

    const authParts = authHeader.split(' ');
    if (authParts.length !== 2 || authParts[0] !== 'Bearer') {
      throw new UnauthorizedException('Formato de autenticación incorrecto');
    }

    const token = authParts[1];

    try {
      const secret = this.configService.get<string>('JWT_SECRET');
      const payload = await this.jwtService.verifyAsync(token, { secret });

      request['user'] = payload;
      request['tokenExp'] = payload.exp;

      return true;
    } catch (error) {
      console.log('Error al verificar el token:', error);
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
