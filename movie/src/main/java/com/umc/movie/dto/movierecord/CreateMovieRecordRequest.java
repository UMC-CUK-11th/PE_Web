package com.umc.movie.dto.movierecord;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CreateMovieRecordRequest( // [1]
        @NotNull(message = "영화 ID는 필수입니다.")
        @Positive(message = "영화 ID는 양수여야 합니다.")
        Long movieId,

        @NotNull(message = "별점은 필수입니다.")
        @Min(value = 1, message = "별점은 1점 이상이어야 합니다.")
        @Max(value = 5, message = "별점은 5점 이하여야 합니다.")
        Integer score,

        String comment,

        @NotNull(message = "즐겨찾기 추가 여부는 필수입니다.")
        Boolean addToFavorites
) {
}

/*
 * [1] 평점 정보와 즐겨찾기 추가 여부를 함께 받는다. memberId는 토큰에서 얻으므로 바디에 없다.
 * Boolean은 null도 표현하므로 @NotNull로 누락을 검사한다. false는 평점만 저장한다는 뜻이다.
 * false가 기존 즐겨찾기를 삭제한다는 뜻은 아니다. comment는 워크북대로 선택값이며 길이 조건은 추가하지 않았다.
 */
