import { forwardRef, Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { cloudinary } from '../config/cloudinary';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [forwardRef(() => ProductsModule), UsersModule],
  providers: [
    FilesService,
    {
      provide: 'CLOUDINARY',
      useValue: cloudinary
    }
  ],
  controllers: [FilesController],
  exports: [FilesService]
})
export class FilesModule {}
