import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseProviders } from './database.provider.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { BookController } from './book/book.controller.js';
import { BookService } from './book/book.service.js';
import { BookRepository } from './book/book.repository.js';
import { RentalController } from './rental/rental.controller.js';
import { RentalService } from './rental/rental.service.js';
import { RentalRepository } from './rental/rental.repository.js';
import { Book } from './entity/book.entity.js';
import { Category } from './entity/category.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.getOrThrow<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT') ?? 3306),
        username: configService.getOrThrow<string>('DB_USER'),
        password: configService.getOrThrow<string>('DB_PASSWORD'),
        database: configService.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    TypeOrmModule.forFeature([Book, Category]),
  ],

  controllers: [AppController, BookController, RentalController],
  providers: [
    ...databaseProviders, // 1. DB 커넥션 풀을 부품으로 등록
    AppService,
    BookService,
    BookRepository,
    RentalService,
    RentalRepository,
  ],
  exports: [...databaseProviders], // 2. 다른 모듈/서비스에서도 쓸 수 있게 공개
})
export class AppModule {}
