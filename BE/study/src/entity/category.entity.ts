import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity.js';

@Entity('category')
export class Category {
  //PK
  @PrimaryGeneratedColumn({ name: 'category_id' })
  categoryId: number;

  @Column()
  name: string;

  //1(Category):N(Book)
  @OneToMany(() => Book, (book) => book.category)
  books: Book[];
}
