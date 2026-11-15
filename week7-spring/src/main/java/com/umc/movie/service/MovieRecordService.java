
package com.umc.movie.service;

import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.MovieRecordRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MovieRecordService {

    private final RatingService ratingService;
    private final FavoriteService favoriteService;

    // 평점과 즐겨찾기를 하나의 트랜잭션으로 저장
    @Transactional
    public Long create(Long memberId, MovieRecordRequest request) {

        // 1. 평점 등록
        CreateRatingRequest ratingRequest = new CreateRatingRequest(
                request.movieId(),
                request.score(),
                request.comment()
        );

        Long ratingId = ratingService.create(memberId, ratingRequest);

        // 2. 즐겨찾기 등록 여부 확인
        if (Boolean.TRUE.equals(request.addToFavorites())) {

            CreateFavoriteRequest favoriteRequest =
                    new CreateFavoriteRequest(request.movieId());

            favoriteService.create(memberId, favoriteRequest);
        }

        // 3. 생성된 평점 ID 반환
        return ratingId;
    }
}
