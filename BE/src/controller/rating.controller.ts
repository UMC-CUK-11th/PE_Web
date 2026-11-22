import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateRatingDto } from '../dto/create-rating.dto.js';
import { UpdateRatingDto } from '../dto/update-rating.dto.js';
import { AuthGuard } from '../guard/auth.guard.js';
import { RatingService } from '../service/rating.service.js';

@ApiTags('평점')
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  @Get('members/:memberId/ratings')
  @ApiOperation({
    summary: '유저별 평점 조회',
    description: '로그인 없이 조회할 수 있습니다.',
  })
  @ApiResponse({ status: 200, description: '평점 목록 조회 성공' })
  @ApiResponse({ status: 400, description: 'COMMON400 — 회원 ID 형식 오류' })
  @ApiResponse({ status: 404, description: 'MEMBER404_1 — 회원을 찾을 수 없음' })
  getMemberRatings(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  @Post('ratings')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: '평점 등록' })
  @ApiResponse({ status: 201, description: 'COMMON201 — 평점 등록 성공' })
  @ApiResponse({ status: 400, description: 'COMMON400 — 입력값 검증 실패' })
  @ApiResponse({ status: 401, description: 'AUTH401_2 — 토큰 누락' })
  @ApiResponse({ status: 404, description: 'MEMBER404_1 — 회원을 찾을 수 없음' })
  @ApiResponse({ status: 409, description: 'RATING409_1 — 이미 평점을 등록한 영화' })
  async create(@Req() request: Request, @Body() dto: CreateRatingDto) {
    const memberId = request['memberId'] as number;
    const result = await this.ratingService.create(memberId, dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '평점을 등록했습니다.',
      result,
    };
  }

  @Patch('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: '내 평점 수정' })
  @ApiResponse({ status: 200, description: 'COMMON200 — 평점 수정 성공' })
  @ApiResponse({ status: 400, description: 'COMMON400 — 평점 ID 또는 입력값 검증 실패' })
  @ApiResponse({ status: 401, description: 'AUTH401_2 — 토큰 누락' })
  @ApiResponse({ status: 403, description: 'RATING403_1 — 다른 회원이 작성한 평점' })
  @ApiResponse({ status: 404, description: 'RATING404_1 — 평점을 찾을 수 없음' })
  async update(
    @Req() request: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const memberId = request['memberId'] as number;
    const result = await this.ratingService.update(memberId, ratingId, dto);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 수정했습니다.',
      result,
    };
  }

  @Delete('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: '내 평점 삭제' })
  @ApiResponse({ status: 200, description: 'COMMON200 — 평점 삭제 성공' })
  @ApiResponse({ status: 400, description: 'COMMON400 — 평점 ID 형식 오류' })
  @ApiResponse({ status: 401, description: 'AUTH401_2 — 토큰 누락' })
  @ApiResponse({ status: 403, description: 'RATING403_1 — 다른 회원이 작성한 평점' })
  @ApiResponse({ status: 404, description: 'RATING404_1 — 평점을 찾을 수 없음' })
  async delete(
    @Req() request: Request,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    const memberId = request['memberId'] as number;
    await this.ratingService.delete(memberId, ratingId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 삭제했습니다.',
      result: null,
    };
  }
}