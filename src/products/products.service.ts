import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './products';
import { ProductDto } from './product.dto';
// @ts-expect-error The lowdb library is an ESM library and this project is a CommonJS project
import type { Low } from 'lowdb';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('DATABASE') private readonly database: Low<{ products: Product[] }>,
  ) {}

  private isNameAvailable(name: string, idToIgnore?: string) {
    const matchingProduct = this.getAll().find((product) => {
      return product.name === name && product.id !== idToIgnore;
    });
    return matchingProduct === undefined;
  }

  doesTheProductExists(productId: string) {
    return this.database.data.products.find(
      (product) => product.id === productId,
    );
  }

  getAll() {
    return this.database.data.products.filter(({ isDeleted }) => !isDeleted);
  }

  getById(id: string) {
    const product = this.database.data.products.find(
      (product) => product.id === id,
    );
    if (product) {
      return product;
    }
    throw new NotFoundException();
  }

  async update(id: string, product: ProductDto) {
    const productIndex = this.database.data.products.findIndex(
      (product) => product.id === id,
    );
    if (productIndex === -1) {
      throw new NotFoundException();
    }
    const originalProduct = this.database.data.products[productIndex];
    if (originalProduct.isDeleted) {
      throw new NotFoundException();
    }
    if (!this.isNameAvailable(product.name, id)) {
      throw new ConflictException('Product with this name already exists');
    }
    this.database.data.products[productIndex] = {
      ...originalProduct,
      name: product.name ?? originalProduct.name,
      priceInEUR: product.priceInEUR ?? originalProduct.priceInEUR,
    };
    await this.database.write();
    return this.database.data.products[productIndex];
  }

  async create(product: ProductDto) {
    if (!this.isNameAvailable(product.name)) {
      throw new ConflictException('Product with this name already exists');
    }
    const newProduct: Product = {
      id: uuid(),
      name: product.name,
      priceInEUR: product.priceInEUR,
      isDeleted: false,
    };
    this.database.data.products.push(newProduct);
    await this.database.write();
    return newProduct;
  }

  async delete(id: string) {
    const productIndex = this.database.data.products.findIndex(
      (product) => product.id === id,
    );
    if (productIndex === -1) {
      throw new NotFoundException();
    }
    const originalProduct = this.database.data.products[productIndex];
    if (originalProduct.isDeleted) {
      throw new NotFoundException();
    }
    this.database.data.products[productIndex] = {
      ...originalProduct,
      isDeleted: true,
    };
    await this.database.write();
    return this.database.data.products[productIndex];
  }
}
