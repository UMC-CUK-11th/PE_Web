import { Injectable } from '@nestjs/common';
import { RentalRepository } from './rental.repository.js';

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async createRental(body: Record<string, any>): Promise<any> {
    const result = await this.rentalRepository.create(body);

    return {
      message: '도서 대여 기록이 생성되었습니다!',
      rentalId: result.insertId,
    };
  }

  async returnRental(rentalId: number): Promise<any> {
    const result = await this.rentalRepository.returnRental(rentalId);

    return {
      message: '도서 반납이 완료되었습니다!',
      rentalId,
      affectedRows: result.affectedRows,
    };
  }
}
