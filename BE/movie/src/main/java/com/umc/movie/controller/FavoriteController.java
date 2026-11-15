package com.umc.movie.controller;

import com.umc.movie.dto.*;
import com.umc.movie.service.FavoriteService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

// memberId는 요청으로 받지 않고, AuthInterceptor가 토큰에서 꺼내 넣어 준 값을 사용합니다.
@RestController
@RequiredArgsConstructor
@Validated
public class FavoriteController {
  private final FavoriteService favoriteService;

  @PostMapping("/favorites")
  public ResponseEntity<ApiResponse<FavoriteResponse>> create(
      @RequestAttribute Long memberId, @Valid @RequestBody CreateFavoriteRequest request) {
    return ResponseEntity.status(201)
        .body(ApiResponse.created("즐겨찾기를 등록했습니다.", favoriteService.create(memberId, request)));
  }

  @GetMapping("/favorites")
  public ApiResponse<List<FavoriteResponse>> getMyFavorites(@RequestAttribute Long memberId) {
    return ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", favoriteService.getMyFavorites(memberId));
  }

  @GetMapping("/favorites/{movieId}")
  public ApiResponse<FavoriteStatusResponse> getStatus(
      @RequestAttribute Long memberId, @PathVariable @Positive Long movieId) {
    return ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", favoriteService.getStatus(memberId, movieId));
  }

  @DeleteMapping("/favorites/{movieId}")
  public ApiResponse<Void> delete(
      @RequestAttribute Long memberId, @PathVariable @Positive Long movieId) {
    favoriteService.delete(memberId, movieId);
    return ApiResponse.ok("즐겨찾기를 해제했습니다.", null);
  }
}
