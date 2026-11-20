package com.umc.movie.dto.movierecord;

import com.umc.movie.dto.rating.RatingResponse;
import com.umc.movie.dto.favorite.FavoriteResponse;

public record MovieRecordResponse( // [1]
        RatingResponse rating,
        FavoriteResponse favorite
) {
}

/*
 * [1] 기존 RatingResponse·FavoriteResponse를 조합한 결과 DTO다.
 * 즐겨찾기 추가를 선택하지 않았다면 favorite는 null이다. 전체 DTO는 공통 응답의 result에 담긴다.
 */
