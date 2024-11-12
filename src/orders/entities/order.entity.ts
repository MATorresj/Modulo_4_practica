import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderDetails } from './orderDetails.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Order {
  @ApiProperty({
    description: 'Identificador único de la orden',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Fecha de la orden',
    example: '2023-10-15T14:48:00.000Z'
  })
  @Column()
  date: Date;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @OneToOne(() => OrderDetails)
  @JoinColumn()
  orderDetails: OrderDetails;
}
