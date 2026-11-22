import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { CreateMemberDto } from '../dto/create-member.dto.js';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto.js';
import { AuthGuard } from '../guard/auth.guard.js';
import { MemberService } from '../service/member.service.js';

@ApiTags('회원')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({ status: 200, description: 'COMMON200 — 회원 정보 조회 성공' })
  @ApiResponse({ status: 401, description: 'AUTH401_2 — 토큰 누락' })
  @ApiResponse({ status: 404, description: 'MEMBER404_1 — 회원을 찾을 수 없음' })
  async getMyInfo(@Req() request: Request) {
    const memberId = request['memberId'] as number;
    const result = await this.memberService.getMyInfo(memberId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result,
    };
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth('bearerAuth')
  @ApiOperation({ summary: '내 닉네임 수정' })
  @ApiResponse({ status: 200, description: 'COMMON200 — 닉네임 수정 성공' })
  @ApiResponse({ status: 400, description: 'COMMON400 — 입력값 검증 실패' })
  @ApiResponse({ status: 401, description: 'AUTH401_2 — 토큰 누락' })
  @ApiResponse({ status: 404, description: 'MEMBER404_1 — 회원을 찾을 수 없음' })
  @ApiResponse({ status: 409, description: 'MEMBER409_1 — 이미 사용 중인 닉네임' })
  async updateMyInfo(@Req() request: Request, @Body() dto: MemberUpdateRequestDto) {
    const memberId = request['memberId'] as number;
    const result = await this.memberService.updateMyInfo(memberId, dto);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 수정했습니다.',
      result,
    };
  }

  @Get('nickname/:nickname')
  checkNickname(@Param('nickname') nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  @Get('email/:email')
  checkEmail(@Param('email') email: string) {
    return this.memberService.checkEmail(email);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 201, description: 'COMMON201 — 회원가입 성공' })
  @ApiResponse({ status: 400, description: 'COMMON400 — 입력값 검증 실패' })
  @ApiResponse({ status: 409, description: 'COMMON409 — 이메일 또는 닉네임 중복' })
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '회원가입에 성공했습니다.',
      result,
    };
  }
}