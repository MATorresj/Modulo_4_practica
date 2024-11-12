import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from 'src/users/dtos/createUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { password, confirmPassword, ...userData } = createUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Las contraseñas no coinciden');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.createUser({
      ...userData,
      password: hashedPassword,
      orders: [],
      isAdmin: false
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async signin(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email o contraseña incorrectos');
    }

    const payload = { email: user.email, sub: user.id, isAdmin: user.isAdmin };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1h'
    });

    return { accessToken };
  }
}
