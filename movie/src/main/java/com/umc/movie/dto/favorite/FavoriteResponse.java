package com.umc.movie.dto.favorite;

import com.umc.movie.entity.Favorite;
import java.time.LocalDateTime;

public record FavoriteResponse(
        Long favoriteId,
        Long movieId,
        LocalDateTime createdAt
) {
    public static FavoriteResponse from(Favorite favorite) { // [1]
        return new FavoriteResponse(
                favorite.getFavoriteId(),
                favorite.getMovieId(),
                favorite.getCreatedAt()
        );
    }
}

/*
 * [1] RatingResponse와 같은 변환 방식이다. 엔티티에서 응답에 필요한 값만 꺼내 새 DTO를 반환한다.
 * static이라 FavoriteResponse.from(favorite)로 호출한다. 자동 변환이나 Bean 주입이 아니다.
 * createdAt은 BaseTimeEntity에서 상속받은 getter로 읽는다.
 * 엔티티의 Member 전체를 응답하지 않으며, 이후 컨트롤러가 이 DTO를 공통 응답의 result에 담는다.
 */
