import { Injectable } from '@nestjs/common';
import { RentalRepository } from './rental.repository.js';

@Injectable()
export class RentalService {
  // 창고지기(BookRepository)를 주입받습니다.
  constructor(private readonly rentalRepository: RentalRepository) {}

  async getAllBooks(): Promise<any> {
    return await this.rentalRepository.findAll();
  }

  async createBook(body: Record<string, any>): Promise<string> {
    await this.rentalRepository.create(body);
    return '대여 등록이 완료되었습니다!';
  }
}
