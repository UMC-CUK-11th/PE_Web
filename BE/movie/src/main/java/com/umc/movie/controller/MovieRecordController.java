package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import com.umc.movie.auth.LoginMember;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.service.MovieRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "영화 기록")
@RestController
@RequiredArgsConstructor
public class MovieRecordController {
    private final MovieRecordService movieRecords;

    @Operation(summary = "영화 기록 저장", description = "평점과 선택한 즐겨찾기를 하나의 트랜잭션으로 저장합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "영화 기록 저장 성공", useReturnTypeSchema = true)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 · 잘못된 요청 형식 또는 입력값", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 · 회원 없음", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1 · 이미 평점을 남긴 영화 / FAVORITE409_1 · 이미 즐겨찾기한 영화 / COMMON4091 · 데이터베이스 제약 위반", content = @Content)
    @PostMapping("/movie-records")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MovieRecordResponse> create(
            @Parameter(hidden = true) @LoginMember Long memberId, @Valid @RequestBody CreateMovieRecordRequest request) {
        return ApiResponse.created("영화 기록을 저장했습니다.", movieRecords.create(memberId, request));
    }
}