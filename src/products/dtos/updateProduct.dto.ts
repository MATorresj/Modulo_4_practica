import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
  /**
   * Nombre del producto
   * @example Producto Actualizado
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  /**
   * Descripción del producto
   * @example Esta es la descripción actualizada
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  /**
   * Precio del producto
   * @example 25.50
   */
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  price?: number;

  /**
   * Stock disponible
   * @example 150
   */
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  stock?: number;

  /**
   * URL de la imagen del producto
   * @example https://imagen-actualizada.com/imagen.jpg
   */
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  imgUrl?: string;
}
