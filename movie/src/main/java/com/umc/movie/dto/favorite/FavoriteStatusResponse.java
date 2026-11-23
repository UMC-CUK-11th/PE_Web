package com.umc.movie.dto.favorite;

public record FavoriteStatusResponse(
        boolean isFavorite // [1]
) {
}

/*
 * [1] 로그인한 회원이 특정 영화를 즐겨찾기했는지 나타낸다.
 * 즐겨찾기하지 않은 경우도 정상 조회 결과이므로 false를 담아 200으로 응답할 예정이다.
 * 이 DTO는 내용물만 정의한다. HTTP 상태와 공통 응답 포장은 이후 컨트롤러에서 정한다.
 */
