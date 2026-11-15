import { Book } from './book.entity.js';

export class BookResponseDto {
  bookId!: number;
  title!: string;
  description!: string | null;
  categoryName!: string | null;
  isAvailable!: boolean;

  constructor(book: Book) {
    this.bookId = book.bookId;
    this.title = book.title;
    this.description = book.description;
    this.categoryName = book.category?.name ?? null;
    this.isAvailable = book.isAvailable;
  }
}