// src/book.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookRepository } from './book.repository.js';
import { Book } from './book.entity.js';
import { Category } from './category.entity.js';
import { BookResponseDto } from './book-response.dto.js';
import { CreateBookRequestDto } from './create-book-request.dto.js';

@Injectable()
export class BookService {
  constructor(
    // 기존 Raw SQL 기능에서 사용
    private readonly bookRepository: BookRepository,

    // Book ORM Repository
    @InjectRepository(Book)
    private readonly ormBookRepository: Repository<Book>,

    // Category ORM Repository
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // 실습 1 - ORM 전체 도서 조회
  async getAllBooks(): Promise<BookResponseDto[]> {
    const books = await this.ormBookRepository.find({
      relations: {
        category: true,
      },
      order: {
        bookId: 'DESC',
      },
    });

    return books.map((book) => new BookResponseDto(book));
  }

  // 실습 2 - ORM 신규 도서 등록
  async createBook(
    request: CreateBookRequestDto,
  ): Promise<BookResponseDto> {
    // 1. categoryId 존재 여부 확인
    const category = await this.categoryRepository.findOne({
      where: {
        categoryId: request.categoryId,
      },
    });

    // 2. 없는 카테고리라면 404 오류
    if (!category) {
      throw new NotFoundException('존재하지 않는 카테고리입니다.');
    }

    // 3. Book Entity 생성
    const book = this.ormBookRepository.create({
      title: request.title,
      description: request.description ?? null,
      category,
      isAvailable: true,
    });

    // 4. DB 저장
    const savedBook = await this.ormBookRepository.save(book);

    // 5. DTO로 변환
    return new BookResponseDto(savedBook);
  }

  // 기존 Raw SQL 카테고리별 조회
  async findByCategory(categoryId: number) {
    return this.bookRepository.findByCategory(categoryId);
  }
}