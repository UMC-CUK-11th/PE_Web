package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.*;
import com.umc.movie.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

// memberId는 요청으로 받지 않고, AuthInterceptor가 토큰에서 꺼내 넣어 준 값을 사용합니다.
// 즐겨찾기 API는 전부 토큰이 필요하므로 클래스 전체에 자물쇠(@SecurityRequirement)를 붙입니다.
@RestController
@RequiredArgsConstructor
@Validated
@Tag(name = "즐겨찾기", description = "영화 즐겨찾기 등록/조회/해제 API (전부 토큰 필요)")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
public class FavoriteController {
  private final FavoriteService favoriteService;

  @Operation(
      summary = "즐겨찾기 등록 (토큰 필요)",
      description = """
          로그인한 회원이 영화를 즐겨찾기에 추가합니다.
          회원 ID는 요청 본문이 아니라 Authorization 헤더의 Bearer 토큰에서 꺼냅니다.
          같은 영화는 한 번만 즐겨찾기할 수 있습니다.
          """)
  @ApiResponses({
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 즐겨찾기 등록 성공"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 movieId 누락 또는 양수가 아님",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "COMMON400", "message": "입력 값의 형식과 범위를 확인해 주세요.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료된 토큰",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "AUTH401_2", "message": "인증 토큰이 필요합니다.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 해당 회원 없음",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "MEMBER404_1", "message": "해당 회원을 찾을 수 없습니다.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "FAVORITE409_1 이미 즐겨찾기한 영화",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "FAVORITE409_1", "message": "이미 이 영화를 즐겨찾기하셨습니다.", "result": null}""")))
  })
  @PostMapping("/favorites")
  public ResponseEntity<ApiResponse<FavoriteResponse>> create(
      @RequestAttribute Long memberId, @Valid @RequestBody CreateFavoriteRequest request) {
    return ResponseEntity.status(201)
        .body(ApiResponse.created("즐겨찾기를 등록했습니다.", favoriteService.create(memberId, request)));
  }

  @Operation(
      summary = "내 즐겨찾기 목록 조회 (토큰 필요)",
      description = "로그인한 회원의 즐겨찾기 목록을 최근 등록순으로 조회합니다. 즐겨찾기가 없으면 빈 배열을 돌려줍니다.")
  @ApiResponses({
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 목록 조회 성공"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료된 토큰",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "AUTH401_2", "message": "인증 토큰이 필요합니다.", "result": null}""")))
  })
  @GetMapping("/favorites")
  public ApiResponse<List<FavoriteResponse>> getMyFavorites(@RequestAttribute Long memberId) {
    return ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", favoriteService.getMyFavorites(memberId));
  }

  @Operation(
      summary = "영화 즐겨찾기 여부 조회 (토큰 필요)",
      description = "로그인한 회원이 해당 영화를 즐겨찾기했는지 isFavorite(true/false)로 알려 줍니다.")
  @ApiResponses({
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 즐겨찾기 여부 조회 성공"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 movieId 형식 오류"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료된 토큰",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "AUTH401_2", "message": "인증 토큰이 필요합니다.", "result": null}""")))
  })
  @GetMapping("/favorites/{movieId}")
  public ApiResponse<FavoriteStatusResponse> getStatus(
      @RequestAttribute Long memberId, @PathVariable @Positive Long movieId) {
    return ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", favoriteService.getStatus(memberId, movieId));
  }

  @Operation(
      summary = "즐겨찾기 해제 (토큰 필요)",
      description = "로그인한 회원의 즐겨찾기에서 해당 영화를 삭제합니다.")
  @ApiResponses({
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 즐겨찾기 해제 성공"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 movieId 형식 오류"),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 토큰 없음 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 만료된 토큰",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "AUTH401_2", "message": "인증 토큰이 필요합니다.", "result": null}"""))),
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "FAVORITE404_1 즐겨찾기한 영화가 아님",
        content = @Content(examples = @ExampleObject(value = """
            {"isSuccess": false, "code": "FAVORITE404_1", "message": "즐겨찾기한 영화를 찾을 수 없습니다.", "result": null}""")))
  })
  @DeleteMapping("/favorites/{movieId}")
  public ApiResponse<Void> delete(
      @RequestAttribute Long memberId, @PathVariable @Positive Long movieId) {
    favoriteService.delete(memberId, movieId);
    return ApiResponse.ok("즐겨찾기를 해제했습니다.", null);
  }
}
