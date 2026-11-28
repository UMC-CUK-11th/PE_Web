package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
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
@Tag(
        name = "평점",
        description = "영화 평점 등록, 조회, 수정, 삭제 API"
)
public class RatingController {

    private final RatingService ratingService;

    @Operation(
            summary = "유저별 평점 조회",
            description = "특정 회원이 작성한 평점 목록을 조회합니다. 로그인 없이 호출할 수 있는 공개 API입니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "평점 목록 조회 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "MEMBER404_1 - 해당 회원을 찾을 수 없음"
            )
    })
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(
            @PathVariable Long memberId
    ) {
        return ratingService.getRatingsByMember(memberId);
    }

    @Operation(
            summary = "평점 등록",
            description = "로그인한 회원이 영화에 평점과 후기를 등록합니다."
    )
    @SecurityRequirement(
            name = SwaggerConfig.BEARER_AUTH
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "201",
                    description = "평점 등록 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "AUTH401_2 - 로그인이 필요한 요청"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "MEMBER404_1 - 해당 회원을 찾을 수 없음"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "409",
                    description = "RATING409_1 - 이미 이 영화에 평점을 등록함"
            )
    })
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId,

            @RequestBody
            @Valid
            CreateRatingRequest request
    ) {
        RatingResponse response =
                ratingService.create(
                        memberId,
                        request
                );

        return ResponseEntity.status(201)
                .body(
                        ApiResponse.created(
                                "평점을 등록했습니다.",
                                response
                        )
                );
    }

    @Operation(
            summary = "평점 수정",
            description = "로그인한 회원이 자신이 작성한 평점과 후기를 수정합니다."
    )
    @SecurityRequirement(
            name = SwaggerConfig.BEARER_AUTH
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "평점 수정 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "AUTH401_2 - 로그인이 필요한 요청"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "RATING403_1 - 본인이 작성한 평점이 아님"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "RATING404_1 - 해당 평점을 찾을 수 없음"
            )
    })
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId,

            @PathVariable
            Long ratingId,

            @RequestBody
            @Valid
            UpdateRatingRequest request
    ) {
        RatingResponse response =
                ratingService.update(
                        memberId,
                        ratingId,
                        request
                );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "평점을 수정했습니다.",
                        response
                )
        );
    }

    @Operation(
            summary = "평점 삭제",
            description = "로그인한 회원이 자신이 작성한 평점을 삭제합니다."
    )
    @SecurityRequirement(
            name = SwaggerConfig.BEARER_AUTH
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "평점 삭제 성공"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "AUTH401_2 - 로그인이 필요한 요청"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "RATING403_1 - 본인이 작성한 평점이 아님"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "RATING404_1 - 해당 평점을 찾을 수 없음"
            )
    })
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID)
            Long memberId,

            @PathVariable
            Long ratingId
    ) {
        ratingService.delete(
                memberId,
                ratingId
        );

        return ResponseEntity.ok(
                ApiResponse.ok(
                        "평점을 삭제했습니다.",
                        null
                )
        );
    }
}