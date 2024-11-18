import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  // Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  NotFoundException,
  InternalServerErrorException
  // BadRequestException
  // ConflictException
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { RemovePasswordInterceptor } from './interceptors/removePassword.interceptor';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ValidateIdDto } from './dtos/validateId.dto';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/guard/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRole } from './user-role.enum';

@Controller('users')
@UseInterceptors(RemovePasswordInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  async getUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5
  ) {
    try {
      const users = await this.usersService.getUsers(page, limit);
      return users;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al obtener usuarios: ${error}`
      );
    }
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUsersById(@Param() params: ValidateIdDto) {
    try {
      const user = await this.usersService.getUsersById(params.id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { isAdmin, ...userWithoutAdmin } = user;
      return userWithoutAdmin;
    } catch (error) {
      throw new NotFoundException(`No se encontró el usuario: ${error}`);
    }
  }

  // @Post()
  // async createUser(@Body() createUserDto: CreateUserDto) {
  //   try {
  //     const newUser = await this.usersService.createUser(createUserDto);
  //     return { id: newUser.id };
  //   } catch (error) {
  //     if (error.code === '23505') {
  //       throw new ConflictException('El correo que ingresaste ya está en uso');
  //     } else {
  //       throw new InternalServerErrorException(
  //         `Error al crear usuario: ${error.message}`
  //       );
  //     }
  //   }
  // }

  @ApiBearerAuth()
  @Put(':id')
  @UseGuards(AuthGuard)
  async updateUser(
    @Param() params: ValidateIdDto,
    @Body() updateUserDto: UpdateUserDto
  ) {
    try {
      const updatedUser = await this.usersService.updateUser(
        params.id,
        updateUserDto
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, isAdmin, ...userWithoutAdminAndPassword } =
        updatedUser.user;
      return {
        message: 'Usuario actualizado con éxito',
        user: userWithoutAdminAndPassword
      };
    } catch (error) {
      throw new NotFoundException(
        `No se encontró el usuario para actualizar: ${error}`
      );
    }
  }

  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param() params: ValidateIdDto) {
    try {
      const deletedUser = await this.usersService.deleteUser(params.id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, isAdmin, ...userWithoutAdminAndPassword } =
        deletedUser.user;
      return {
        message: 'Usuario eliminado con éxito',
        user: userWithoutAdminAndPassword
      };
    } catch (error) {
      throw new NotFoundException(
        `No se encontró el usuario para eliminar: ${error}`
      );
    }
  }

  // @ApiBearerAuth()
  // @Put('makeAdmin/:id')
  // @UseGuards(AuthGuard, RolesGuard)
  // @Roles(UserRole.User)
  // async promoteToAdmin(@Param('id') userId: string) {
  //   try {
  //     const user = await this.usersService.makeAdmin(userId);
  //     return { message: 'Usuario promovido a admin', user };
  //   } catch (error) {
  //     throw new BadRequestException(
  //       'No se pudo promover al usuario a admin: ' + error
  //     );
  //   }
  // }
}
