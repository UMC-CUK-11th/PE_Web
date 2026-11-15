import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  
  import { Category } from './category.entity.js';
  
  @Entity('book')
  export class Book {
    @PrimaryGeneratedColumn({ name: 'id' })
    bookId!: number;
  
    @Column()
    title!: string;
  
    @Column({
      type: 'varchar',
      length: 255,
      nullable: true,
    })
    description!: string | null;
  
    @Column({
      name: 'is_available',
      type: 'boolean',
      default: true,
    })
    isAvailable!: boolean;
  
    @ManyToOne(() => Category, { nullable: true })
    @JoinColumn({ name: 'category_id' })
    category!: Category | null;
  }