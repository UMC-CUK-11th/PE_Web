package com.umc.movie.dto;

// 즐겨찾기하지 않은 것도 정상 상태라서 404 대신 isFavorite: false로 알려줘요.
public record FavoriteStatusResponse(boolean isFavorite) {}
