import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  /**
   * Correo electrónico del usuario
   * @example usuario@ejemplo.com
   */
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * Contraseña del usuario
   * @example Password!123
   */
  @IsString()
  @IsNotEmpty()
  password: string;
}
