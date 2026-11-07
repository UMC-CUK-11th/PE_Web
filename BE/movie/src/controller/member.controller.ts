import { Controller, Get, Param } from "@nestjs/common";
import { MemberService } from "../service/member.service.js";
import { EmailParamsDto, NicknameParamsDto } from "../dto/check-params.dto.js";

@Controller("members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get("nickname/:nickname")
  checkNickname(@Param() params: NicknameParamsDto) {
    return this.memberService.checkNickname(params.nickname);
  }

  @Get("email/:email")
  checkEmail(@Param() params: EmailParamsDto) {
    return this.memberService.checkEmail(params.email);
  }
}
