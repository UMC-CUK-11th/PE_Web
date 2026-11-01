package com.umc.movie.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.umc.movie.entity.Rating;
import java.time.LocalDateTime;
public record RatingResponse(Long ratingId, Long movieId, Integer score, String comment,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime createdAt,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss") LocalDateTime updatedAt) {
    public static RatingResponse from(Rating rating) {
        return new RatingResponse(rating.getRatingId(), rating.getMovieId(), rating.getScore().intValue(),
                rating.getComment(), rating.getCreatedAt(), rating.getUpdatedAt());
    }
}
