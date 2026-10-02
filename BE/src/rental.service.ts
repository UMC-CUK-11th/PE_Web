import { Injectable } from '@nestjs/common';
import { RentalRepository } from './rental.repository.js';

@Injectable()
export class RentalService {
  constructor(private readonly rentalRepository: RentalRepository) {}

  async create(body: Record<string, any>) {
    return this.rentalRepository.create(body);
  }
}