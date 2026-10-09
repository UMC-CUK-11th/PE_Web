import { Controller, Get } from '@nestjs/common';
import { RentalService } from './rental.service.js';

import { Body, Post } from '@nestjs/common';

@Controller('rental')
export class RentalController {
  // 주방장(BookService)을 주입받습니다.
  constructor(private readonly rentalService: RentalService) {}

  // HTTP GET 방식으로 /books 요청이 들어왔을 때 실행되는 핸들러
  @Get()
  async getBooks(): Promise<any> {
    return await this.rentalService.getAllBooks();
  }

  // POST http://localhost:3000/books
  @Post()
  async createBook(@Body() body: Record<string, any>): Promise<string> {
    return await this.rentalService.createBook(body);
  }
}
