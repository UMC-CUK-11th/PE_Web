
package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "즐겨찾기 API", description = "회원의 영화 즐겨찾기 관리")
@RestController
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    // 즐겨찾기 등록
    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @RequestAttribute("memberId") Long memberId,
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response =
                favoriteService.create(memberId, request);

        return ResponseEntity.status(201)
                .body(ApiResponse.created(
                        "즐겨찾기를 등록했습니다.",
                        response
                ));
    }

    // 내 즐겨찾기 목록 조회
    @Operation(summary = "내 즐겨찾기 조회", description = "로그인한 회원의 즐겨찾기 목록 조회. JWT 토큰 필요")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @RequestAttribute("memberId") Long memberId
    ) {
        List<FavoriteResponse> response =
                favoriteService.getMyFavorites(memberId);

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "내 즐겨찾기 목록을 조회했습니다.",
                        response
                )
        );
    }

    // 특정 영화 즐겨찾기 여부 조회
    @Operation(summary = "즐겨찾기 여부 조회", description = "특정 영화의 즐겨찾기 여부 확인. JWT 토큰 필요")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @RequestAttribute("memberId") Long memberId,
            @PathVariable Long movieId
    ) {
        FavoriteStatusResponse response =
                favoriteService.getStatus(memberId, movieId);

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "즐겨찾기 여부를 조회했습니다.",
                        response
                )
        );
    }

    // 즐겨찾기 해제
    @Operation(summary = "즐겨찾기 해제", description = "특정 영화의 즐겨찾기 해제. JWT 토큰 필요")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute("memberId") Long memberId,
            @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "즐겨찾기를 해제했습니다.",
                        null
                )
        );
    }
}
