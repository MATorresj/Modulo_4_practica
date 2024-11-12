import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsUUID,
  ValidateNested
} from 'class-validator';

class ProductDto {
  /**
   * ID del usuario que realiza la orden
   * @example 1c32f9e7-8ac9-4c20-9949-1c4b5d8b7e8f
   */
  @IsUUID()
  id: string;
}

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  /**
   * Lista de productos incluidos en la orden
   */
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductDto)
  products: ProductDto[];
}
