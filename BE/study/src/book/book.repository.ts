import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entity/book.entity.js';
import { Category } from '../entity/category.entity.js';

//DTO로 받을 데이터를 검사하고, 보낼 데이터의 모양을 정함.
import { CreateBookDto } from './book.dto.js';

@Injectable()
export class BookRepository {
  constructor(
    @InjectRepository(Book)
    private readonly books: Repository<Book>,
    @InjectRepository(Category)
    private readonly categories: Repository<Category>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.books.find({
      relations: { category: true },
      order: { bookId: 'DESC' },
    });
  }

  findByCategoryId(categoryId: number): Promise<Book[]> {
    return this.books.find({
      where: { category: { categoryId } },
      relations: { category: true },
    });
  }

  async create(dto: CreateBookDto): Promise<Book> {
    const category = await this.categories.findOneBy({
      categoryId: dto.categoryId,
    });
    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }

    const book = this.books.create({
      category,
      title: dto.title,
      description: dto.description ?? null,
      isAvailable: true,
    });
    return this.books.save(book);
  }
}
