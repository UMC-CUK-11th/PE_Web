import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { databaseProviders } from './database.provider.js';

import { AppController } from './app.controller.js';

import { AppService } from './app.service.js';

import { BooksModule } from './books/book.module.js';

import { RentalController } from './rental.controller.js';

import { RentalService } from './rental.service.js';

import { RentalRepository } from './rental.repository.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'mysql',

        host: configService.get<string>('DB_HOST', 'localhost'),

        port: Number(configService.get<string>('DB_PORT', '3306')),

        username: configService.get<string>('DB_USER', 'root'),

        password: configService.get<string>('DB_PASSWORD', ''),

        database: configService.get<string>('DB_NAME', 'study'),

        autoLoadEntities: true,

        synchronize: false,
      }),
    }),

    BooksModule,
  ],

  controllers: [AppController, RentalController],

  providers: [
    ...databaseProviders,

    AppService,

    RentalService,
    RentalRepository,
  ],

  exports: [...databaseProviders],
})
export class AppModule {}
