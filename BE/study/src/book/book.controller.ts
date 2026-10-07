import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { BookService } from './book.service.js';
import { BookResponseDto, CreateBookDto } from './book.dto.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBooks(): Promise<BookResponseDto[]> {
    return this.bookService.getAllBooks();
  }

  @Get('category/:categoryId')
  findByCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ): Promise<BookResponseDto[]> {
    return this.bookService.getByCategoryIdBooks(categoryId);
  }

  @Post()
  createBook(
    @Body(new ValidationPipe({ transform: true, whitelist: true }))
    dto: CreateBookDto,
  ): Promise<BookResponseDto> {
    return this.bookService.createBook(dto);
  }
}
