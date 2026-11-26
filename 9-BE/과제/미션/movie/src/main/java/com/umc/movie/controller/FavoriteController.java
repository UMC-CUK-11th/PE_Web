package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.config.SwaggerExamples;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/favorites")
@Tag(name = "즐겨찾기", description = "로그인한 회원의 영화 즐겨찾기 API")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH) // 이 컨트롤러의 모든 API가 토큰을 요구한다
public class FavoriteController {

    private final FavoriteService favoriteService;

    @Operation(summary = "즐겨찾기 등록", description = "토큰의 주인인 회원이 TMDB 영화 ID 하나를 즐겨찾기에 추가합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "즐겨찾기 등록 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON201",
                              "message": "즐겨찾기를 등록했습니다.",
                              "result": { "favoriteId": 1, "movieId": 550, "createdAt": "2026-11-26T21:00:00" }
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400", description = "영화 ID가 없거나 양수가 아님 (COMMON4001)",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = SwaggerExamples.COMMON4001_MOVIE_ID))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = SwaggerExamples.UNAUTHORIZED_DESCRIPTION,
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = SwaggerExamples.AUTH401_2))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 즐겨찾기한 영화 (FAVORITE409_1)",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = SwaggerExamples.FAVORITE409_1)))
    })
    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Valid @RequestBody CreateFavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.create(memberId, request);
        return ResponseEntity.status(201).body(ApiResponse.created("즐겨찾기를 등록했습니다.", response));
    }

    @Operation(summary = "내 즐겨찾기 조회", description = "토큰의 주인인 회원의 즐겨찾기를 최신순으로 조회합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공, 없으면 빈 배열"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = SwaggerExamples.UNAUTHORIZED_DESCRIPTION,
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = SwaggerExamples.AUTH401_2)))
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        return ResponseEntity.ok(ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", favoriteService.getMyFavorites(memberId)));
    }

    // 즐겨찾기하지 않은 것도 정상 상태라 404 대신 isFavorite: false로 답한다
    @Operation(
            summary = "즐겨찾기 여부 조회",
            description = "영화 하나를 즐겨찾기했는지 확인합니다. 하지 않았어도 오류가 아니라 200과 isFavorite false를 돌려줍니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = SwaggerExamples.UNAUTHORIZED_DESCRIPTION,
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = SwaggerExamples.AUTH401_2)))
    })
    @GetMapping("/{movieId}")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Parameter(description = "TMDB 영화 ID", example = "550") @PathVariable Long movieId
    ) {
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", favoriteService.getStatus(memberId, movieId)));
    }

    @Operation(summary = "즐겨찾기 해제", description = "즐겨찾기한 영화를 목록에서 뺍니다. 성공하면 200과 result null을 돌려줍니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "해제 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = SwaggerExamples.UNAUTHORIZED_DESCRIPTION,
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = SwaggerExamples.AUTH401_2))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404", description = "즐겨찾기하지 않은 영화 (FAVORITE404_1)",
                    content = @Content(mediaType = "application/json",
                            examples = @ExampleObject(value = SwaggerExamples.FAVORITE404_1)))
    })
    @DeleteMapping("/{movieId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @Parameter(hidden = true) @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Parameter(description = "TMDB 영화 ID", example = "550") @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기를 해제했습니다.", null));
    }
}
