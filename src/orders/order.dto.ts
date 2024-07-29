import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from './orders';
import { Type } from 'class-transformer';

export class OrderedProductDto {
  @IsNumber()
  @ApiProperty()
  quantity: number;
  @IsString()
  @ApiProperty()
  id: string;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  address: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderedProductDto)
  @ApiProperty({ type: () => OrderedProductDto, isArray: true })
  products: OrderedProductDto[];
}

export class UpdateOrderDto {
  @IsEnum(Status)
  @ApiProperty({ enum: Status })
  status: Status;
}
