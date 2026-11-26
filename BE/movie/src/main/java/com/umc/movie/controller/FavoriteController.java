package com.umc.movie.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import com.umc.movie.auth.LoginMember;
import com.umc.movie.dto.*;
import com.umc.movie.exception.ApiException;
import com.umc.movie.service.FavoriteService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "즐겨찾기")
@RestController
@RequestMapping("/favorites")
@RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService favorites;
    public record Status(Long movieId, boolean isFavorite) {}

    @Operation(summary = "내 즐겨찾기 조회", description = "로그인한 회원의 즐겨찾기 목록을 조회합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "내 즐겨찾기 조회 성공", useReturnTypeSchema = true)
    @GetMapping
    public ApiResponse<List<FavoriteResponse>> list(@Parameter(hidden = true) @LoginMember Long memberId) {
        return ApiResponse.ok("즐겨찾기를 조회했습니다.", favorites.list(memberId));
    }

    @Operation(summary = "즐겨찾기 여부 조회", description = "로그인한 회원이 해당 영화를 즐겨찾기했는지 조회합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "즐겨찾기 여부 조회 성공", useReturnTypeSchema = true)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 · 잘못된 요청 형식 또는 입력값", content = @Content)
    @GetMapping("/{movieId}")
    public ApiResponse<Status> status(@Parameter(hidden = true) @LoginMember Long memberId, @PathVariable Long movieId) {
        requirePositive(movieId);
        return ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", new Status(movieId, favorites.contains(memberId, movieId)));
    }

    @Operation(summary = "즐겨찾기 등록", description = "로그인한 회원이 TMDB 영화 ID로 즐겨찾기를 등록합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "즐겨찾기 등록 성공", useReturnTypeSchema = true,
            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                    {"isSuccess":true,"code":"COMMON201","message":"즐겨찾기에 추가했습니다.","result":{"favoriteId":1,"movieId":550,"createdAt":"2026-09-13T21:00:00"}}
                    """)))
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 · 잘못된 요청 형식 또는 입력값", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 · 회원 없음", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "FAVORITE409_1 · 이미 즐겨찾기한 영화 / COMMON4091 · 데이터베이스 제약 위반",
            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                    {"isSuccess":false,"code":"FAVORITE409_1","message":"이미 즐겨찾기한 영화입니다.","result":null}
                    """)))
    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(@Parameter(hidden = true) @LoginMember Long memberId, @Valid @RequestBody CreateFavoriteRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created("즐겨찾기에 추가했습니다.", favorites.create(memberId, request.movieId())));
    }

    @Operation(summary = "즐겨찾기 해제", description = "로그인한 회원의 즐겨찾기에서 해당 영화를 제거합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "즐겨찾기 해제 성공", useReturnTypeSchema = true)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001 · 잘못된 요청 형식 또는 입력값", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "FAVORITE404_1 · 즐겨찾기한 영화가 아님", content = @Content)
    @DeleteMapping("/{movieId}")
    public ApiResponse<Void> delete(@Parameter(hidden = true) @LoginMember Long memberId, @PathVariable Long movieId) {
        requirePositive(movieId);
        favorites.delete(memberId, movieId);
        return ApiResponse.ok("즐겨찾기를 해제했습니다.", null);
    }

    private void requirePositive(Long movieId) {
        if (movieId <= 0) throw new ApiException(HttpStatus.BAD_REQUEST, "COMMON4001", "영화 ID는 양수여야 합니다.");
    }
}
