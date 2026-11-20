package com.umc.movie.dto.favorite;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateFavoriteRequest(
        @NotNull(message = "영화 ID는 필수입니다.")
        @Positive(message = "영화 ID는 양수여야 합니다.")
        Long movieId // [1]
) {
}

/*
 * [1] 요청 바디에는 TMDB 영화 번호만 받는다. 회원 ID는 토큰에서 얻으므로 DTO에 넣지 않는다.
 * Long은 누락 시 null이 될 수 있어 @NotNull로 필수 입력을, @Positive로 양수를 검사한다.
 * 실제 요청 검증은 이후 컨트롤러의 @Valid와 연결된다.
 */
