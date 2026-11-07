
package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
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

@RestController
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // 기존 5주차: 회원별 평점 조회 (인증 불필요)
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @PathVariable Long memberId
    ) {
        return ratingService.getRatingsByMember(memberId);
    }

    // 7주차: JWT 기반 평점 등록
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
