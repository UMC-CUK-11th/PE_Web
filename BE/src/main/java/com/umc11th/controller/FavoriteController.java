package com.umc11th.controller;

import com.umc11th.auth.LoginMember;
import com.umc11th.dto.ApiResponse;
import com.umc11th.dto.CreateFavoriteRequest;
import com.umc11th.dto.FavoriteResponse;
import com.umc11th.dto.FavoriteStatusResponse;
import com.umc11th.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Favorites", description = "로그인한 회원의 즐겨찾기 API")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @Operation(summary = "즐겨찾기 등록", description = "토큰의 회원에게 영화를 즐겨찾기로 등록합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201",
            description = "COMMON201 - 등록 성공"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "409",
            description = "FAVORITE409_1 - 이미 등록한 영화"
    )
    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = CreateFavoriteRequest.class),
                            examples = @ExampleObject(value = "{\"movieId\":550}")
                    )
            )
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", response));
    }

    @Operation(summary = "내 즐겨찾기 조회")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "COMMON200 - 최신 등록 순 목록"
    )
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @Parameter(hidden = true) @LoginMember Long memberId
    ) {
        List<FavoriteResponse> response = favoriteService.getMyFavorites(memberId);
        return ResponseEntity.ok(
                ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", response)
        );
    }

    @Operation(summary = "특정 영화의 즐겨찾기 여부 조회")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "COMMON200 - isFavorite true 또는 false"
    )
    @GetMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @PathVariable Long movieId
    ) {
        FavoriteStatusResponse response = favoriteService.getStatus(memberId, movieId);
        return ResponseEntity.ok(
                ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", response)
        );
    }

    @Operation(summary = "즐겨찾기 해제")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "COMMON200 - 해제 성공"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "FAVORITE404_1 - 즐겨찾기를 찾을 수 없음"
    )
    @DeleteMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ResponseEntity.ok(
                ApiResponse.ok("즐겨찾기를 해제했습니다.", null)
        );
    }
}
