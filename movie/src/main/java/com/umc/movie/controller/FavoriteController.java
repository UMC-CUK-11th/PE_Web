package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import com.umc.movie.dto.common.ApiResponse;
import com.umc.movie.dto.favorite.CreateFavoriteRequest;
import com.umc.movie.dto.favorite.FavoriteResponse;
import com.umc.movie.dto.favorite.FavoriteStatusResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.FavoriteService;
import jakarta.validation.Valid;
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

@RestController
@RequiredArgsConstructor
@Tag(name = "즐겨찾기", description = "로그인한 회원의 영화 즐겨찾기 API") // [Swagger 1]
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH) // [Swagger 2]
public class FavoriteController {

    private final FavoriteService favoriteService;

    @Operation(
            summary = "즐겨찾기 등록",
            description = "토큰의 주인인 회원이 TMDB 영화 ID 하나를 즐겨찾기에 추가합니다."
    )
    // 우리가 만든 공통 응답 DTO 이름도 ApiResponse라서, Swagger 쪽 애노테이션은 풀네임으로 적습니다.
    @ApiResponses({ // [Swagger 3]
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201", description = "즐겨찾기 등록 성공",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": true,
                              "code": "COMMON201",
                              "message": "즐겨찾기를 등록했습니다.",
                              "result": { "favoriteId": 1, "movieId": 550, "createdAt": "2026-09-13T21:00:00" }
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401", description = "토큰이 없거나 유효하지 않음",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "AUTH401_2",
                              "message": "로그인이 필요한 요청입니다.",
                              "result": null
                            }
                            """))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409", description = "이미 즐겨찾기한 영화",
                    content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                            {
                              "isSuccess": false,
                              "code": "FAVORITE409_1",
                              "message": "이미 이 영화를 즐겨찾기하셨습니다.",
                              "result": null
                            }
                            """)))
    })
    @PostMapping("/favorites") // [1]
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", response));
    }

    @Operation(summary = "내 즐겨찾기 목록 조회", description = "Bearer 토큰이 필요합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401",
            description = "토큰 누락 AUTH401_2, 유효하지 않은 토큰 AUTH401_3, 만료 AUTH401_4", content = @Content)
    @GetMapping("/favorites") // [2]
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        List<FavoriteResponse> response = favoriteService.getMyFavorites(memberId);
        return ResponseEntity.ok(ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", response));
    }

    @Operation(summary = "즐겨찾기 여부 조회", description = "Bearer 토큰이 필요합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401",
            description = "토큰 누락 AUTH401_2, 유효하지 않은 토큰 AUTH401_3, 만료 AUTH401_4", content = @Content)
    @GetMapping("/favorites/{movieId}") // [3]
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        FavoriteStatusResponse response = favoriteService.getStatus(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", response));
    }

    @Operation(summary = "즐겨찾기 해제", description = "Bearer 토큰이 필요합니다.")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401",
            description = "토큰 누락 AUTH401_2, 유효하지 않은 토큰 AUTH401_3, 만료 AUTH401_4", content = @Content)
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
            description = "즐겨찾기를 찾을 수 없음 FAVORITE404_1", content = @Content)
    @DeleteMapping("/favorites/{movieId}") // [4]
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기를 해제했습니다.", null));
    }
}

/*
 * 공통: 네 경로 모두 기존 인증 인터셉터의 검사 대상이다. WebConfig의 공개 예외에 추가하지 않는다.
 * @RequestAttribute는 토큰 검증 후 요청 속성에 저장된 회원 ID를 Spring이 매개변수로 넣게 한다.
 * 회원 ID는 URL·바디에서 받지 않는다. 이 클래스에 공통 경로 매핑은 없어 각 메서드가 전체 경로를 가진다.
 * 서비스 예외는 기존 전역 처리기에 맡기고 정상 반환일 때만 아래 성공 응답을 만든다.
 *
 * [1] JSON 바디의 movieId를 DTO로 받고 @Valid로 필수·양수 검증 후 서비스에 전달한다.
 * 생성 결과를 공통 응답 result에 담아 실제 HTTP 201과 COMMON201로 반환한다.
 *
 * [2] 내 목록을 result 배열로 반환한다. 데이터가 없어도 200과 빈 배열인 정상 응답이다.
 * POST와 경로는 같지만 HTTP 메서드가 달라 별도의 API로 연결된다.
 *
 * [3] 경로의 영화 ID와 요청 속성의 회원 ID로 즐겨찾기 여부를 확인한다.
 * false여도 200이며 result는 isFavorite 속성을 가진 DTO다. 토큰이 없는 경우의 인증 실패와 다르다.
 *
 * [4] 같은 영화 ID 경로라도 DELETE이면 해제 동작으로 연결된다.
 * 서비스는 void지만 응답 자체는 반환한다. 본문 없는 204 대신 200·COMMON200·result=null을 유지한다.
 */

// [Swagger 1] @Tag는 Swagger UI에서 컨트롤러의 API를 묶고, @Operation은 각 요청의 목적을 설명한다.
// [Swagger 2] @SecurityRequirement는 문서에 Bearer 인증을 연결한다. 토큰 검증은 인터셉터가 한다.
// [Swagger 3] @ApiResponses는 HTTP 코드별 JSON 예시를 문서화한다. DTO와 이름이 겹쳐 어노테이션은 패키지까지 적는다.
