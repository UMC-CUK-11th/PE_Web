
package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.MovieRecordRequest;
import com.umc.movie.service.MovieRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class MovieRecordController {

    private final MovieRecordService movieRecordService;

    // 평점과 즐겨찾기를 하나의 트랜잭션으로 저장
    @PostMapping("/movie-records")
    public ResponseEntity<ApiResponse<Long>> create(
            @RequestAttribute("memberId") Long memberId,
            @Valid @RequestBody MovieRecordRequest request
    ) {
        Long ratingId = movieRecordService.create(memberId, request);

        return ResponseEntity.status(201)
                .body(ApiResponse.created(
                        "영화 기록을 저장했습니다.",
                        ratingId
                ));
    }
}
