import { Book } from '../entity/book.entity.js';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  //카테고리ID가 숫자이고, 1 이상의 정수이어야 한다.
  @IsInt()
  @Min(1)
  @Type(() => Number)
  categoryId: number;

  //제목은 비어있지 않은 100자 이하의 문자열
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  title: string;

  //설명은 생략 가능
  @IsOptional()
  @IsString()
  description?: string;
}

export class BookResponseDto {
  bookId: number;
  title: string;
  description: string | null;
  categoryName: string;
  isAvailable: boolean;

  static from(book: Book): BookResponseDto {
    return {
      bookId: book.bookId,
      title: book.title,
      description: book.description,
      categoryName: book.category.name,
      isAvailable: book.isAvailable,
    };
  }
}
