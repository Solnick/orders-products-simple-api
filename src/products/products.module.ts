import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import ProductsController from './products.controller';
import { Product } from './products';

@Module({
  exports: [ProductsService],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    {
      provide: 'DATABASE',
      useFactory: async () => {
        const { JSONFilePreset } = await import('lowdb/node');

        const initialProducts: Product[] = [];

        return JSONFilePreset('db.json', {
          products: initialProducts,
        });
      },
    },
  ],
})
export class ProductsModule {}
