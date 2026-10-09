// src/book.repository.ts
import { Injectable, Inject } from '@nestjs/common';
import type { Pool } from 'mysql2/promise';
import { DATABASE_CONNECTION } from '../database.provider.js';

@Injectable() // NestJS 컨테이너에 "나 주입 가능한 부품이야!"라고 등록
export class RentalRepository {
  constructor(
    // 2단계에서 우리가 등록해둔 DB 커넥션 풀(DATABASE_CONNECTION)을 가져옵니다.
    @Inject(DATABASE_CONNECTION) private readonly pool: Pool,
  ) {}

  async findAll(): Promise<any> {
    const sql = 'SELECT * FROM rental';
    const [rows] = await this.pool.query(sql);
    return rows;
  }

  async create(body: Record<string, any>): Promise<any> {
    const sql =
      'INSERT INTO rental (user_id, book_id, rented_at, due_at, returned_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY), NULL)';

    // 두 번째 인자로 넘긴 배열이 ? 자리에 순서대로 안전하게 바인딩됩니다.
    const [result] = await this.pool.execute(sql, [body.user_id, body.book_id]);
    return result;
  }
}
