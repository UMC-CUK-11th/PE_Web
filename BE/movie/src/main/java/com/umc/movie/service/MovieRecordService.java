package com.umc.movie.service;

import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.MovieRecordResponse;
import com.umc.movie.dto.RatingResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MovieRecordService {
    private final RatingService ratings;
    private final FavoriteService favorites;

    // 두 서비스의 기본 REQUIRED 트랜잭션은 이 트랜잭션에 참여합니다.
    @Transactional
    public MovieRecordResponse create(Long memberId, CreateMovieRecordRequest request) {
        Long movieId = request.movieId();
        RatingResponse rating = ratings.create(memberId, new CreateRatingRequest(movieId, request.score(), request.comment()));
        FavoriteResponse favorite = request.addToFavorites() ? favorites.create(memberId, movieId) : null;
        return new MovieRecordResponse(rating, favorite);
    }
}