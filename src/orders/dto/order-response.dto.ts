import { Product } from 'src/products/entities/product.entity';

export class OrderResponseDto {
  /**
   * ID de la orden
   * @example 1c32f9e7-8ac9-4c20-9949-1c4b5d8b7e8f
   */
  orderId: string;
  /**
   * Fecha de la orden
   * @example 2023-10-15T12:30:00Z
   */
  date: Date;
  /**
   * ID del usuario
   * @example 2d89f320-8c2f-4b49-876e-534a589fa50d
   */
  userId: string;
  /**
   * Detalles de la orden
   */
  orderDetails: {
    /**
     * Precio total de la orden
     * @example 99.99
     */
    price: number;
    /**
     * Lista de productos en la orden
     */
    products: Product[];
  };
}
