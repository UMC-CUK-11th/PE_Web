import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBookRequestDto {
  @IsInt()
  categoryId!: number;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;
}