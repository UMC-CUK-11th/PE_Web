package com.umc.movie.dto.member;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MemberUpdateRequest( // [1]
        @NotBlank(message = "닉네임을 입력해주세요.")
        @Size(min = 2, max = 12, message = "닉네임은 2자 이상 12자 이하여야 합니다.")
        String nickname
) {
}

/*
 * [1] 수정할 닉네임만 받는 DTO다. 회원 ID는 바디가 아니라 인증 후 요청 속성에서 받는다.
 * 컨트롤러의 @Valid가 @NotBlank로 빈 값 등을, @Size로 2~12자 길이를 검사한다.
 * 다른 회원과의 닉네임 중복은 DB 조회가 필요하므로 서비스·레포지토리에서 따로 확인한다.
 */
