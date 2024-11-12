import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({
  name: 'users'
})
@Unique(['email'])
export class User {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Perez' })
  @Column({ length: 50 })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan@example.com'
  })
  @Column({ length: 50 })
  email: string;

  //pendiente corrección
  @ApiProperty({
    description: 'Contraseña del usuario (hashed)',
    example: 'hashed_password_123'
  })
  @Column({ length: 100 })
  password: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: '+1234567890'
  })
  @Column()
  phone: string;

  @ApiProperty({ description: 'País del usuario', example: 'Colombia' })
  @Column({ length: 50 })
  country: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle Falsa 123'
  })
  @Column('text')
  address: string;

  @ApiProperty({ description: 'Ciudad del usuario', example: 'Medellin' })
  @Column({ length: 50 })
  city: string;

  @ApiProperty({
    description: 'Define si el usuario es administrador',
    example: false,
    default: false
  })
  @Column({ default: false })
  isAdmin: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
