package com.umc.movie.controller;

import com.umc.movie.auth.LoginMember;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.service.MovieRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class MovieRecordController {
    private final MovieRecordService movieRecords;

    @PostMapping("/movie-records")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<MovieRecordResponse> create(
            @LoginMember Long memberId, @Valid @RequestBody CreateMovieRecordRequest request) {
        return ApiResponse.created("영화 기록을 저장했습니다.", movieRecords.create(memberId, request));
    }
}