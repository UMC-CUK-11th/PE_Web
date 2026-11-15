package com.umc.movie.dto;

// addToFavorites가 false이면 favorite는 null입니다.
public record MovieRecordResponse(RatingResponse rating, FavoriteResponse favorite) {}
