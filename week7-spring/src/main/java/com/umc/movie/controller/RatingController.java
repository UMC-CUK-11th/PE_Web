
package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.service.RatingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "평점 API", description = "영화 평점 등록, 조회, 수정, 삭제")
@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // 기존 5주차: 회원별 평점 조회 (인증 불필요)
    @Operation(summary = "유저별 평점 조회", description = "특정 회원이 등록한 평점 목록 조회. JWT 토큰 불필요")
@GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @PathVariable Long memberId
    ) {
        return ratingService.getRatingsByMember(memberId);
    }

    // 7주차: JWT 기반 평점 등록
    @Operation(summary = "평점 등록", description = "영화 평점 등록. JWT 토큰 필요. 중복 등록 시 HTTP 409, code RATING409_1")
@SecurityRequirement(name = "bearerAuth")
@PostMapping("/ratings")
    public ResponseEntity<ApiResponse<Long>> create(
            HttpServletRequest httpRequest,
            @Valid @RequestBody CreateRatingRequest request
    ) {
        Long memberId = (Long) httpRequest.getAttribute("memberId");

        Long ratingId = ratingService.create(memberId, request);

        return ResponseEntity.status(201)
                .body(ApiResponse.created(
                        "평점 등록에 성공했습니다.",
                        ratingId
                ));
    }

    // 7주차: JWT 기반 평점 수정
    @Operation(summary = "평점 수정", description = "본인이 작성한 평점 수정. JWT 토큰 필요. 다른 회원의 평점 수정 시 HTTP 403, code RATING403_1")
@SecurityRequirement(name = "bearerAuth")
@PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> update(
            @PathVariable Long ratingId,
            HttpServletRequest httpRequest,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        Long memberId = (Long) httpRequest.getAttribute("memberId");

        ratingService.update(ratingId, memberId, request);

        return ResponseEntity.ok(
                ApiResponse.ok("평점 수정에 성공했습니다.", null)
        );
    }

    // 7주차: JWT 기반 평점 삭제
    @Operation(summary = "평점 삭제", description = "본인이 작성한 평점 삭제. JWT 토큰 필요")
@SecurityRequirement(name = "bearerAuth")
@DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long ratingId,
            HttpServletRequest httpRequest
    ) {
        Long memberId = (Long) httpRequest.getAttribute("memberId");

        ratingService.delete(ratingId, memberId);

        return ResponseEntity.ok(
                ApiResponse.ok("평점 삭제에 성공했습니다.", null)
        );
    }
}
