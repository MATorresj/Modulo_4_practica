import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dtos/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signin(@Body() loginDto: LoginDto) {
    try {
      const { accessToken } = await this.authService.signin(loginDto);
      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException(
        `Email o contraseña incorrectos: ${error}`
      );
    }
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }
    try {
      const user = await this.authService.signup(createUserDto);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isAdmin, ...userWithoutAdmin } = user;
      return userWithoutAdmin;
    } catch (error) {
      throw new BadRequestException(`Error al crear el usuario: ${error}`);
    }
  }
}
