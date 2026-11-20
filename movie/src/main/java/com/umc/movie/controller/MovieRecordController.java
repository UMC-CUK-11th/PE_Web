package com.umc.movie.controller;

import com.umc.movie.dto.common.ApiResponse;
import com.umc.movie.dto.movierecord.CreateMovieRecordRequest;
import com.umc.movie.dto.movierecord.MovieRecordResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.MovieRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MovieRecordController {

    private final MovieRecordService movieRecordService;

    @PostMapping("/movie-records") // [1]
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateMovieRecordRequest request
    ) {
        MovieRecordResponse response = movieRecordService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("영화 기록을 저장했습니다.", response));
    }
}

/*
 * [1] 기존 인증 인터셉터에서 확인한 회원 ID와 @Valid로 검증한 바디를 서비스에 전달한다.
 * 트랜잭션은 서비스에서 관리하고 여기서 두 저장 서비스를 따로 호출하지 않는다.
 * 정상 처리하면 HTTP 201·COMMON201, result 안에 rating과 favorite를 반환한다.
 * addToFavorites=false이면 favorite는 null이다. 예외는 기존 전역 처리기가 공통 실패 응답으로 바꾼다.
 * 여러 저장을 묶는 학습용 API이며 프론트에서 반드시 사용할 필요는 없다.
 */
