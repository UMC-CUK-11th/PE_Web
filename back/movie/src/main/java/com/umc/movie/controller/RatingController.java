package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.umc.movie.config.OpenApiConfig.BEARER_AUTH;
import static com.umc.movie.config.OpenApiConfig.UNAUTHORIZED;

@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @Operation(summary = "회원별 평점 조회", description = "지정한 회원의 평점을 최신 등록순으로 조회함. 토큰이 필요하지 않음.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "평점 목록 조회 성공")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 잘못된 회원 ID 형식",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원을 찾을 수 없음",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(@PathVariable Long memberId) {
        return ratingService.getRatingsByMember(memberId);
    }

    @Operation(summary = "평점 등록", description = "로그인한 회원이 영화에 평점을 등록함.", security = @SecurityRequirement(name = BEARER_AUTH))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "평점 등록 성공")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 잘못된 요청 본문 또는 입력값",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", ref = UNAUTHORIZED)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원을 찾을 수 없음",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1 같은 영화에 이미 평점을 등록함 / COMMON4091 DB 제약 위반",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    @Operation(summary = "평점 수정", description = "로그인한 회원이 작성한 평점과 후기를 수정함.", security = @SecurityRequirement(name = BEARER_AUTH))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "평점 수정 성공")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 잘못된 평점 ID, 요청 본문 또는 입력값",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", ref = UNAUTHORIZED)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 다른 회원이 작성한 평점",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 평점을 찾을 수 없음",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId,
            @RequestBody @Valid UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    @Operation(summary = "평점 삭제", description = "로그인한 회원이 작성한 평점을 삭제함.", security = @SecurityRequirement(name = BEARER_AUTH))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "평점 삭제 성공")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 잘못된 평점 ID 형식",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", ref = UNAUTHORIZED)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 다른 회원이 작성한 평점",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 평점을 찾을 수 없음",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}
