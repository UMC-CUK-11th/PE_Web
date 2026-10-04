// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.provider.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BookController } from './book.controller.js';
import { BookService } from './book.service.js';
import { BookRepository } from './book.repository.js';
import { RentalRepository } from './rental.repository.js';
import { RentalService } from './rental.service.js';
import { RentalController } from './rental.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    AppController,
    BookController,
    RentalController // 추가!
  ],
  providers: [
    ...databaseProviders,
    AppService,
    BookService, // 추가!
    BookRepository, 
    RentalService,
    RentalRepository// 추가
  ],
  exports: [...databaseProviders],
})
export class AppModule {}
