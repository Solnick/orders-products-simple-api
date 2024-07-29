import {
  Body,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post,
  Put
} from "@nestjs/common";
import { ProductsService } from './products.service';
import { ProductDto } from './product.dto';

@Controller('products')
export default class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getAll() {
    return this.productsService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.productsService.getById(id);
  }

  @Post()
  create(@Body() product: ProductDto) {
    return this.productsService.create(product);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() product: ProductDto) {
    return this.productsService.update(id, product);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.productsService.delete(id);
  }
}
