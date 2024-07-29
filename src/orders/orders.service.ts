import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { Order, OrderedProduct, Status } from './orders';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
// @ts-expect-error The lowdb library is an ESM library and this project is a CommonJS project
import type { Low } from 'lowdb';
import { v4 as uuid } from 'uuid';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('DATABASE') private readonly database: Low<{ orders: Order[] }>,
    @Inject() private readonly productsService: ProductsService,
  ) {}

  getAll() {
    return this.database.data.orders;
  }

  getById(id: string) {
    const order = this.database.data.orders.find((order) => order.id === id);
    if (order) {
      return order;
    }
    throw new NotFoundException();
  }

  async update(id: string, order: UpdateOrderDto) {
    const orderIndex = this.database.data.orders.findIndex(
      (order) => order.id === id,
    );
    if (orderIndex === -1) {
      throw new NotFoundException();
    }
    this.database.data.orders[orderIndex] = {
      ...this.database.data.orders[orderIndex],
      status: order.status,
    };
    await this.database.write();
    return this.database.data.orders[orderIndex];
  }
  isCartValid(products: OrderedProduct[]) {
    return products.every((product) =>
      this.productsService.doesTheProductExists(product.id),
    );
  }

  async create(order: CreateOrderDto) {
    if (!this.isCartValid(order.products)) {
      throw new BadRequestException('Such a product does not exist.');
    }
    const newOrder: Order = {
      id: uuid(),
      status: Status.InProgress,
      address: order.address,
      products: order.products,
    };
    this.database.data.orders.push(newOrder);
    await this.database.write();
    return newOrder;
  }

  async delete(id: string) {
    const orderIndex = this.database.data.orders.findIndex(
      (order) => order.id === id,
    );
    if (orderIndex === -1) {
      throw new NotFoundException();
    }
    this.database.data.orders.splice(orderIndex, 1);
    await this.database.write();
  }
}
