package com.umc.movie.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MemberUpdateRequest(
        @NotBlank
        @Size(max = 50)
        String nickname
) {}