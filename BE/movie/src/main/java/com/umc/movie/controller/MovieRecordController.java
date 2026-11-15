package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.service.MovieRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class MovieRecordController {
  private final MovieRecordService movieRecordService;

  @PostMapping("/movie-records")
  public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
      @RequestAttribute Long memberId, @Valid @RequestBody CreateMovieRecordRequest request) {
    return ResponseEntity.status(201)
        .body(ApiResponse.created("영화 기록을 저장했습니다.", movieRecordService.create(memberId, request)));
  }
}
