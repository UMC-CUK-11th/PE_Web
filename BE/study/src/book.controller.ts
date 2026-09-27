import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service.js';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // GET /books
  @Get()
  async getBooks(): Promise<any> {
    return await this.bookService.getAllBooks();
  }

  // POST /books
  @Post()
  async createBook(@Body() body: Record<string, any>): Promise<string> {
    return await this.bookService.createBook(body);
  }

  // 필수 미션 1
  // GET /books/category/{categoryId}
  @Get('category/:categoryId')
  async getBooksByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<any> {
    return await this.bookService.getBooksByCategory(Number(categoryId));
  }
}
