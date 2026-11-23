package com.umc11th.controller;

import com.umc11th.auth.LoginMember;
import com.umc11th.dto.ApiResponse;
import com.umc11th.dto.CreateMovieRecordRequest;
import com.umc11th.dto.MovieRecordResponse;
import com.umc11th.service.MovieRecordService;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Movie Records", description = "평점과 즐겨찾기를 한 트랜잭션으로 저장하는 API")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequiredArgsConstructor
public class MovieRecordController {

    private final MovieRecordService movieRecordService;

    @Operation(
            summary = "영화 기록 저장",
            description = "평점을 저장하고 addToFavorites가 true이면 즐겨찾기도 함께 저장합니다."
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201",
            description = "COMMON201 - 영화 기록 저장 성공"
    )
    @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "409",
            description = "RATING409_1 또는 FAVORITE409_1 - 중복 기록"
    )
    @PostMapping("/movie-records")
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
            @Parameter(hidden = true) @LoginMember Long memberId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    content = @Content(
                            schema = @Schema(implementation = CreateMovieRecordRequest.class),
                            examples = @ExampleObject(value = """
                                    {
                                      "movieId": 238,
                                      "score": 5,
                                      "comment": "다시 보고 싶은 영화입니다.",
                                      "addToFavorites": true
                                    }
                                    """)
                    )
            )
            @RequestBody @Valid CreateMovieRecordRequest request
    ) {
        MovieRecordResponse response = movieRecordService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("영화 기록을 저장했습니다.", response));
    }
}
