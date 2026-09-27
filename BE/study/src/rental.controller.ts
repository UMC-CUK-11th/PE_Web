import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { RentalService } from './rental.service.js';

@Controller('rentals')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  // 필수 미션 2
  // POST /rentals
  @Post()
  async createRental(@Body() body: Record<string, any>): Promise<any> {
    return await this.rentalService.createRental(body);
  }

  // 선택 미션
  // PATCH /rentals/{rentalId}/return
  @Patch(':rentalId/return')
  async returnRental(@Param('rentalId') rentalId: string): Promise<any> {
    return await this.rentalService.returnRental(Number(rentalId));
  }
}
