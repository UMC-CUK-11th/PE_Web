package com.umc.movie.dto;

// addToFavorites가 false면 favorite는 null이에요.
public record MovieRecordResponse(
        RatingResponse rating,
        FavoriteResponse favorite
) {}
