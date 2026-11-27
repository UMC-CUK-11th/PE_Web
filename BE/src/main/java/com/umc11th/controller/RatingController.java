package com.umc11th.controller;

import com.umc11th.config.OpenApiConfig;
import com.umc11th.dto.ApiResponse;
import com.umc11th.dto.CreateRatingRequest;
import com.umc11th.dto.RatingResponse;
import com.umc11th.dto.UpdateRatingRequest;
import com.umc11th.service.RatingService;
import com.umc11th.auth.LoginMember;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "평점", description = "영화 평점 등록, 조회, 수정과 삭제 API")
public class RatingController {

    private final RatingService ratingService;

    @Operation(
            summary = "회원별 평점 조회",
            description = "특정 회원이 작성한 평점을 최신순으로 조회하는 공개 API입니다."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "평점 목록 조회 성공"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404", description = "MEMBER404_1 - 회원을 찾을 수 없음"
    )
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @PathVariable Long memberId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ratingService.getRatingsByMember(memberId, page, size);
    }

    @Operation(summary = "평점 등록", description = "토큰의 회원이 영화에 평점을 등록합니다.")
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201", description = "COMMON201 - 평점 등록 성공"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "401", description = "AUTH401_2/3/4 - 인증 실패"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "409", description = "RATING409_1 - 같은 영화의 평점 중복"
    )
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @Valid @RequestBody CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    @Operation(summary = "평점 수정", description = "토큰의 회원이 본인의 평점을 수정합니다.")
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "COMMON200 - 평점 수정 성공"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403", description = "RATING403_1 - 다른 회원의 평점"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404", description = "RATING404_1 - 평점을 찾을 수 없음"
    )
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @PathVariable Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    @Operation(summary = "평점 삭제", description = "토큰의 회원이 본인의 평점을 삭제합니다.")
    @SecurityRequirement(name = OpenApiConfig.BEARER_AUTH)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200", description = "COMMON200 - 평점 삭제 성공"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403", description = "RATING403_1 - 다른 회원의 평점"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404", description = "RATING404_1 - 평점을 찾을 수 없음"
    )
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}
