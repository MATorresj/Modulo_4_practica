import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class UpdateUserDto {
  /**
   * Nombre del usuario
   * @example Juan Perez
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  /**
   * Correo electrónico del usuario
   * @example usuario@ejemplo.com
   */
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email?: string;

  /**
   * Nueva contraseña del usuario
   * @example NewPassword!123
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;

  /**
   * Dirección del usuario
   * @example Calle Falsa 123
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;

  /**
   * Teléfono del usuario
   * @example "123456789"
   */
  @IsString()
  @IsOptional()
  phone?: string;

  /**
   * País del usuario
   * @example Colombia
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  country?: string;

  /**
   * Ciudad del usuario
   * @example Medellín
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  city?: string;
}
