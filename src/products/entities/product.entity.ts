import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn
} from 'typeorm';
import { Category } from '../../categories/category.entity';
import { OrderDetails } from '../../orders/entities/orderDetails.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('products')
export class Product {
  @ApiProperty({
    description: 'Identificador único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre del producto', example: 'Laptop' })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Laptop de alta calidad'
  })
  @Column('text')
  description: string;

  @ApiProperty({ description: 'Precio del producto', example: 1499.99 })
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({ description: 'Cantidad de stock disponible', example: 100 })
  @Column()
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://image.url'
  })
  @Column({
    default: 'https://cdn-icons-png.flaticon.com/512/1170/1170679.png'
  })
  imgUrl: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ApiProperty({
    description: 'Identificador de la categoría del producto',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @Column({ nullable: true })
  categoryId: string;

  @ManyToMany(() => OrderDetails, (orderDetails) => orderDetails.products)
  @JoinTable()
  orderDetails: OrderDetails[];
}
