import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';

@Controller('orders')
export default class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  getAll() {
    return this.ordersService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.ordersService.getById(id);
  }

  @Post()
  create(@Body() order: CreateOrderDto) {
    return this.ordersService.create(order);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() order: UpdateOrderDto) {
    return this.ordersService.update(id, order);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.ordersService.delete(id);
  }
}
