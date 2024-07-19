import { IsString, IsNotEmpty } from 'class-validator';

export class ArticleDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  title: string;
}
