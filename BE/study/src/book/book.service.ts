import { Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository.js';
import { BookResponseDto, CreateBookDto } from './book.dto.js';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.findAll();
    return books.map((book) => BookResponseDto.from(book));
  }

  async getByCategoryIdBooks(categoryId: number): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.findByCategoryId(categoryId);
    return books.map((book) => BookResponseDto.from(book));
  }

  async createBook(dto: CreateBookDto): Promise<BookResponseDto> {
    const book = await this.bookRepository.create(dto);
    return BookResponseDto.from(book);
  }
}
