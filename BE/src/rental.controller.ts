import { Body, Controller, Post } from '@nestjs/common';
import { RentalService } from './rental.service.js';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post()
  async create(@Body() body: Record<string, any>) {
    await this.rentalService.create(body);

    return '도서 대여가 완료되었습니다!';
  }
}