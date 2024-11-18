import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  Matches
} from 'class-validator';

export class CreateUserDto {
  /**
   * Correo electrónico del usuario
   * @example usuario@ejemplo.com
   */
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * Nombre del usuario, mínimo 3 caracteres, máximo 80
   * @example Juan Perez
   */
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  name: string;

  /**
   * la contraseña debe ser una contraseña dificil de encontrar
   * @example Hola123!
   */
  @IsNotEmpty()
  @IsString()
  // @Length(8, 15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, {
    message:
      'La contraseña debe incluir al menos una letra mayuscula, una letra minuscula, un numero y un caracter especial (!@#$%^&*)'
  })
  password: string;

  /**
   * Confirmación de la contraseña
   * @example Hola123!
   */
  @IsNotEmpty()
  @IsString()
  confirmPassword: string;

  /**
   * Dirección del usuario
   * @example Calle Falsa 123
   */
  @IsNotEmpty()
  @IsString()
  @Length(3, 80)
  address: string;

  /**
   * Teléfono del usuario
   * @example "123456789"
   */
  @IsNotEmpty()
  @IsNumberString()
  phone: string;

  /**
   * País del usuario
   * @example Colombia
   */
  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  country: string;

  /**
   * Ciudad del usuario
   * @example Medellín
   */
  @IsNotEmpty()
  @IsString()
  @Length(5, 20)
  city: string;
}
