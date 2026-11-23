package com.umc.movie.controller;

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
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping("/favorites") // [1]
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", response));
    }

    @GetMapping("/favorites") // [2]
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        List<FavoriteResponse> response = favoriteService.getMyFavorites(memberId);
        return ResponseEntity.ok(ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", response));
    }

    @GetMapping("/favorites/{movieId}") // [3]
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        FavoriteStatusResponse response = favoriteService.getStatus(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", response));
    }

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
