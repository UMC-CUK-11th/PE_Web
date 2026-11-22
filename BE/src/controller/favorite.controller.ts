import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateFavoriteDto } from '../dto/create-favorite.dto.js';
import { AuthGuard } from '../guard/auth.guard.js';
import { FavoriteService } from '../service/favorite.service.js';

@ApiTags('즐겨찾기')
@ApiBearerAuth('bearerAuth')
@ApiResponse({
  status: 401,
  description: 'AUTH401_2: 토큰 누락, AUTH401_3: 유효하지 않은 토큰, AUTH401_4: 토큰 만료',
})
@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '즐겨찾기 등록' })
  @ApiResponse({ status: 201, description: 'COMMON201 — 즐겨찾기 등록 성공' })
  @ApiResponse({ status: 400, description: 'COMMON400 — 영화 ID 검증 실패' })
  @ApiResponse({ status: 404, description: 'MEMBER404_1 — 회원을 찾을 수 없음' })
  @ApiResponse({
    status: 409,
    description: 'FAVORITE409_1 — 이미 즐겨찾기에 등록한 영화',
    schema: {
      example: {
        isSuccess: false,
        code: 'FAVORITE409_1',
        message: '이미 이 영화를 즐겨찾기하셨습니다.',
        result: null,
      },
    },
  })
  async create(@Req() request: Request, @Body() dto: CreateFavoriteDto) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.create(memberId, dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '즐겨찾기를 등록했습니다.',
      result,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '내 즐겨찾기 목록 조회' })
  @ApiResponse({ status: 200, description: 'COMMON200 — 즐겨찾기 목록 조회 성공' })
  async getMyFavorites(@Req() request: Request) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.getMyFavorites(memberId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '내 즐겨찾기 목록을 조회했습니다.',
      result,
    };
  }

  @Get(':movieId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '영화의 즐겨찾기 여부 조회' })
  @ApiResponse({
    status: 200,
    description: 'COMMON200 — 등록하지 않은 영화는 isFavorite: false 반환',
  })
  @ApiResponse({ status: 400, description: 'COMMON400 — 영화 ID 형식 오류' })
  async getStatus(
    @Req() request: Request,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const memberId = request['memberId'] as number;
    const result = await this.favoriteService.getStatus(memberId, movieId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기 여부를 조회했습니다.',
      result,
    };
  }

  @Delete(':movieId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '즐겨찾기 해제' })
  @ApiResponse({ status: 200, description: 'COMMON200 — 즐겨찾기 해제 성공' })
  @ApiResponse({ status: 400, description: 'COMMON400 — 영화 ID 형식 오류' })
  @ApiResponse({ status: 404, description: 'FAVORITE404_1 — 즐겨찾기한 영화를 찾을 수 없음' })
  async delete(
    @Req() request: Request,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const memberId = request['memberId'] as number;
    await this.favoriteService.delete(memberId, movieId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기를 해제했습니다.',
      result: null,
    };
  }
}