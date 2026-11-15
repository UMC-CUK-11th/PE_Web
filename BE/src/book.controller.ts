// src/book.controller.ts

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { BookService } from './book.service.js';
import { BookResponseDto } from './book-response.dto.js';
import { CreateBookRequestDto } from './create-book-request.dto.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // 실습 1: 전체 도서 조회
  @Get()
  async getBooks(): Promise<BookResponseDto[]> {
    return this.bookService.getAllBooks();
  }

  // 실습 2: 신규 도서 등록
  @Post()
  async createBook(
    @Body() request: CreateBookRequestDto,
  ): Promise<BookResponseDto> {
    return this.bookService.createBook(request);
  }

  // 기존 카테고리별 도서 조회
  @Get('category/:categoryId')
  async findByCategory(
    @Param('categoryId') categoryId: string,
  ) {
    return this.bookService.findByCategory(Number(categoryId));
  }
}