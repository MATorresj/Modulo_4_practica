import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import typeOrmConfig from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.get('typeorm')
    }),
    OrderModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    AuthModule,
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '1h'
      },
      secret: process.env.JWT_SECRET
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
