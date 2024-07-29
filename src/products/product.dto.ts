import { IsString, IsNotEmpty, IsNumber, Min } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumber()
  @ApiProperty()
  @Min(0)
  priceInEUR: number;
}
