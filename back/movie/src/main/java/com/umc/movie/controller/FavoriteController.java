package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.umc.movie.config.OpenApiConfig.BEARER_AUTH;
import static com.umc.movie.config.OpenApiConfig.UNAUTHORIZED;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = BEARER_AUTH)
@io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", ref = UNAUTHORIZED)
public class FavoriteController {

    private final FavoriteService favoriteService;

    @Operation(summary = "즐겨찾기 등록", description = "로그인한 회원의 즐겨찾기에 영화를 추가함.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "즐겨찾기 등록 성공")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 잘못된 요청 본문 또는 영화 ID",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원을 찾을 수 없음",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "FAVORITE409_1 이미 즐겨찾기에 등록한 영화",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", response));
    }

    @Operation(summary = "내 즐겨찾기 조회", description = "로그인한 회원의 즐겨찾기를 최신 등록순으로 조회함.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "즐겨찾기 목록 조회 성공")
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        List<FavoriteResponse> response = favoriteService.getMyFavorites(memberId);
        return ResponseEntity.ok(ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", response));
    }

    @Operation(summary = "즐겨찾기 여부 조회", description = "로그인한 회원이 해당 영화를 즐겨찾기에 등록했는지 확인함.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "즐겨찾기 여부 조회 성공")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 양의 정수가 아닌 영화 ID",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @GetMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable @Positive(message = "영화 ID는 양수여야 합니다.") Long movieId
    ) {
        FavoriteStatusResponse response = favoriteService.getStatus(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", response));
    }

    @Operation(summary = "즐겨찾기 해제", description = "로그인한 회원의 즐겨찾기에서 해당 영화를 삭제함.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "즐겨찾기 해제 성공")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 양의 정수가 아닌 영화 ID",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "FAVORITE404_1 해제할 즐겨찾기를 찾을 수 없음",
            content = @Content(schema = @Schema(implementation = ApiResponse.class)))
    @DeleteMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable @Positive(message = "영화 ID는 양수여야 합니다.") Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기를 해제했습니다.", null));
    }
}
