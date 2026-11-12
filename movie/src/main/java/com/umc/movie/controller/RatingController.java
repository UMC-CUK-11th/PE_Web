// src/main/java/com/umc/movie/controller/RatingController.java
package com.umc.movie.controller;

import com.umc.movie.dto.rating.RatingResponse;
import com.umc.movie.dto.common.ApiResponse;
import com.umc.movie.dto.rating.CreateRatingRequest;
import com.umc.movie.dto.rating.UpdateRatingRequest;
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestAttribute;
import com.umc.movie.interceptor.AuthInterceptor;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @GetMapping("/members/{memberId}/ratings") // [4]
    public ApiResponse<List<RatingResponse>> getMemberRatings(@PathVariable Long memberId) {
        return ApiResponse.ok("평점 목록 조회에 성공했습니다.",
                ratingService.getRatingsByMember(memberId));
    }

    @PostMapping("/ratings") // [1]
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Valid @RequestBody CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201).body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    @PatchMapping("/ratings/{ratingId}") // [2]
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    @DeleteMapping("/ratings/{ratingId}") // [3]
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}

/*
 * 공통: 쓰기 요청의 memberId는 @RequestAttribute로 검증된 요청 속성에서 받는다.
 * 공개 조회만 URL의 memberId를 사용하고 기존 공통 응답 형식을 유지한다.
 * @PathVariable은 평점 ID, @RequestBody는 요청 DTO, @Valid는 입력 검증에 사용한다.
 * [1] 등록: 인증된 회원 ID와 DTO를 전달하고 RatingResponse를 받아 HTTP 201로 반환한다.
 * [2] 수정: (memberId, ratingId, DTO) 순서로 전달하고 수정 결과 RatingResponse를 HTTP 200으로 반환한다.
 * [3] 삭제: (memberId, ratingId)를 전달하고 HTTP 200과 result=null인 공통 본문을 반환한다.
 *
 * [4] 공개 조회는 특정 회원의 목록을 선택하므로 URL의 memberId를 유지한다.
 * WebConfig에서 인증 인터셉터 대상에서 제외해 누구나 조회할 수 있다.
 *
 * 경로 변경과 DB 관계는 별개다.
 * 6주차에는 클래스의 /members와 메서드 경로를 합쳐 쓰기 요청의 회원 ID를 URL로 받았다.
 * 이제 인터셉터가 토큰을 검증하고 request에 저장한 회원 ID를 Spring의 @RequestAttribute로 받는다.
 * 지난 방식에서 남의 회원 ID를 URL에 넣어 작성자인 척할 수 있었던 문제를 이 신원 확인으로 막는다.
 * Tomcat이 제공한 요청 객체는 검증 결과를 이번 요청의 다음 처리 단계로 전달하는 통로다.
 * 쓰기 API에 더 이상 회원 ID 경로가 필요 없으므로 /ratings로 정리했다.
 * 클래스에 /members를 남기고 메서드에 /ratings를 적으면 실제 주소는 /members/ratings가 된다.
 * 이때 /ratings로 호출하면 그 주소에 맞는 컨트롤러 매핑이 없어 404가 발생한다.
 * 따라서 클래스 공통 매핑을 제거하고, 공개 조회에는 /members를 포함한 전체 경로를 적는다.
 * URL에서 회원 경로를 제거해도 Rating.member와 DB의 rating.member_id FK는 그대로다.
 * 회원별 조회·평점 생성·소유권 검사에서 그 관계를 계속 쓰므로 @ManyToOne·LAZY 설정도 유지한다.
 */
