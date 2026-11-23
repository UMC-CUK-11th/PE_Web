package com.umc.movie.dto;

import jakarta.validation.constraints.*;

public record CreateMovieRecordRequest(
        @NotNull @Positive Long movieId,
        @NotNull @Min(1) @Max(5) Integer score,
        @Size(max = 500) String comment,
        @NotNull Boolean addToFavorites
) {}