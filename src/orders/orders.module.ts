import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import OrdersController from './orders.controller';
import { Order } from './orders';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    {
      provide: 'DATABASE',
      useFactory: async () => {
        const { JSONFilePreset } = await import('lowdb/node');

        const initialOrders: Order[] = [];

        return JSONFilePreset('db.json', {
          orders: initialOrders,
        });
      },
    },
  ],
})
export class OrdersModule {}
