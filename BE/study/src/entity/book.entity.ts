import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity.js';

@Entity('book')
export class Book {
  //PK
  @PrimaryGeneratedColumn({ name: 'book_id' })
  bookId: number;

  // N(Book):1(Category)
  @ManyToOne(() => Category, (category) => category.books, {
    nullable: false,
  }) //FK
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;
}
