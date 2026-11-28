package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import com.umc.movie.auth.LoginMember;
import com.umc.movie.dto.*;
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "평점")
@RestController
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;

    @Operation(summary = "회원별 평점 조회", description = "해당 회원의 평점 목록을 공개 조회합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "회원별 평점 조회 성공", useReturnTypeSchema = true)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 · 잘못된 요청 형식 또는 입력값", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 · 회원 없음", content = @Content)
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(@PathVariable Long memberId) {
        return ratingService.getRatingsByMember(memberId);
    }

    @Operation(summary = "평점 등록", description = "로그인한 회원의 영화 평점과 후기를 등록합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "평점 등록 성공", useReturnTypeSchema = true)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 · 잘못된 요청 형식 또는 입력값", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 · 회원 없음", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1 · 이미 평점을 남긴 영화 / COMMON4091 · 데이터베이스 제약 위반", content = @Content)
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(@Parameter(hidden = true) @LoginMember Long memberId, @Valid @RequestBody CreateRatingRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created("평점을 등록했습니다.", ratingService.create(memberId, request)));
    }

    @Operation(summary = "평점 수정", description = "본인이 등록한 평점과 후기를 수정합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "평점 수정 성공", useReturnTypeSchema = true)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 · 잘못된 요청 형식 또는 입력값", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 · 본인이 작성한 평점만 수정하거나 삭제할 수 있음", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 · 평점 없음", content = @Content)
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(@Parameter(hidden = true) @LoginMember Long memberId, @PathVariable Long ratingId, @Valid @RequestBody UpdateRatingRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", ratingService.update(memberId, ratingId, request)));
    }

    @Operation(summary = "평점 삭제", description = "본인이 등록한 평점을 삭제합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "평점 삭제 성공", useReturnTypeSchema = true)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 · 잘못된 요청 형식 또는 입력값", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 · 본인이 작성한 평점만 수정하거나 삭제할 수 있음", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 · 평점 없음", content = @Content)
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(@Parameter(hidden = true) @LoginMember Long memberId, @PathVariable Long ratingId) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}