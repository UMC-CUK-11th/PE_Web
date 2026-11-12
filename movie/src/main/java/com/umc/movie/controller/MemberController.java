// src/main/java/com/umc/movie/controller/MemberController.java
package com.umc.movie.controller;

import com.umc.movie.dto.member.EmailCheckResponse;
import com.umc.movie.dto.common.ApiResponse;
import com.umc.movie.dto.member.NicknameCheckResponse;
import com.umc.movie.dto.member.MemberResponse;
import com.umc.movie.dto.member.SignUpRequest;
import com.umc.movie.service.MemberService;
import com.umc.movie.dto.member.MemberInfoResponse;
import com.umc.movie.dto.member.MemberUpdateRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/nickname/{nickname}")
    public ApiResponse<NicknameCheckResponse> checkNickname(@PathVariable String nickname) {
        return ApiResponse.ok("닉네임 중복 확인에 성공했습니다.",
                memberService.checkNickname(nickname));
    }

    @GetMapping("/email/{email}")
    public ApiResponse<EmailCheckResponse> checkEmail(@PathVariable String email) {
        return ApiResponse.ok("이메일 중복 확인에 성공했습니다.",
                memberService.checkEmail(email));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }
    @GetMapping("/me") // [1]
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId // [2]
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId); // [3]
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", response));
    }

    @PatchMapping("/me") // [4]
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response = memberService.updateMyInfo(memberId, request);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", response));
    }

}

/*
 * [1] 클래스 경로 /members와 합쳐 GET /members/me를 처리한다.
 * URL에 회원 ID를 넣지 않고, 인증 인터셉터가 확인한 회원 ID를 사용한다.
 *
 * [2] 인터셉터에서 저장한 요청 속성을 실제로 받는 지점이다.
 * 저장: request.setAttribute(AuthInterceptor.MEMBER_ID, memberId);
 * 조회: @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
 * 상수를 풀면 저장할 때도, 꺼낼 때도 같은 이름표인 "memberId"를 사용하는 것이다.
 * 요청 객체는 현재 내장 Tomcat이 제공하고, @RequestAttribute는 Spring이 제공하는 어노테이션이다.
 * Spring이 같은 요청 객체에서 "memberId"라는 속성을 찾아 이 매개변수에 넣는다.
 * 상수에 회원 번호를 넣거나 Java 필드를 새로 만드는 것이 아니라, 요청의 속성 공간에 저장한 값을 받는다.
 * 클라이언트가 보낸 바디나 URL에서 직접 받는 값이 아니라 인터셉터가 검증 후 남긴 서버 내부 정보다.
 *
 * [3] 받은 회원 ID를 서비스에 전달해 DTO를 얻고, 공통 본문의 result에 담아 HTTP 200으로 응답한다.
 * 컨트롤러는 토큰을 직접 읽거나 검사하지 않는다. 그 작업은 앞의 인터셉터와 JwtUtil이 담당한다.
 * 전체 흐름: 인증 헤더 → 인터셉터의 토큰 검증 → 요청 속성에 ID 저장 → Spring이 매개변수로 전달
 * → 서비스의 회원 조회 → 응답 DTO → 공통 성공 응답.
 *
 * [4] PATCH /members/me: 인증된 회원 ID와 변경할 닉네임을 서로 다른 곳에서 받는다.
 * @RequestAttribute는 인터셉터가 요청 속성에 저장한 ID를, @RequestBody는 JSON의 닉네임을 받는다.
 * @Valid가 닉네임 빈 값·길이를 검사하고, 서비스가 회원 존재·자신을 제외한 중복을 검사한다.
 * 수정 결과 DTO를 공통 본문의 result에 담아 HTTP 200으로 반환한다.
 */
