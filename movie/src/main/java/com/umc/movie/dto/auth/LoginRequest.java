package com.umc.movie.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest( // [1]
        @NotBlank(message = "이메일을 입력해주세요.")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        String email,

        // 로그인에서는 가입 시 비밀번호 규칙을 다시 검사하지 않습니다.
        @NotBlank(message = "비밀번호를 입력해주세요.")
        String password
) {
}

/*
 * [1] 로그인 JSON의 email·password를 담는 요청 DTO다. 값은 email(), password()로 꺼낸다.
 * 컨트롤러의 @Valid가 @NotBlank로 빈 값 등을, @Email로 이메일 형식을 검사한다.
 * 비밀번호는 빈 값만 검사한다. 가입 후 규칙이 바뀌어도 기존 회원이 로그인할 수 있어야 하기 때문이다.
 * 입력한 비밀번호가 실제로 맞는지는 서비스의 matches가 확인한다. 이 DTO에서 해시하지 않는다.
 */
