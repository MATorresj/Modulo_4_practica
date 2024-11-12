import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  /**
   * Nombre del producto
   * @example Producto Ejemplo
   */
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * Descripción del producto
   * @example Este es un producto de ejemplo
   */
  @IsNotEmpty()
  @IsString()
  description: string;

  /**
   * Precio del producto
   * @example 19.99
   */
  @IsNotEmpty()
  @IsNumber()
  price: number;

  /**
   * Stock disponible del producto
   * @example 100
   */
  @IsNotEmpty()
  @IsNumber()
  stock: number;

  /**
   * URL de la imagen del producto
   * @example https://imagen-producto.com/imagen.jpg
   */
  @IsOptional()
  @IsString()
  imgUrl: string;

  /**
   * ID de la categoría del producto
   * @example 1c32f9e7-8ac9-4c20-9949-1c4b5d8b7e8f
   */
  @IsNotEmpty()
  categoryId: string;
}
