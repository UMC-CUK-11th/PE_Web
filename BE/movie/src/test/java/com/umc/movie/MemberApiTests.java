package com.umc.movie;

import com.umc.movie.config.WebConfig;
import com.umc.movie.controller.MemberController;
import com.umc.movie.controller.RatingController;
import com.umc.movie.entity.Rating;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.service.MemberService;
import com.umc.movie.service.RatingService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest({MemberController.class, RatingController.class})
@Import({MemberService.class, RatingService.class, WebConfig.class})
class MemberApiTests {
    @Autowired MockMvc mvc;
    @MockitoBean MemberRepository members;
    @MockitoBean RatingRepository ratings;

    @Test
    void nicknameAvailabilityIsInverseOfExistence() throws Exception {
        when(members.existsByNickname("수현")).thenReturn(true);
        mvc.perform(get("/members/nickname/{nickname}", "수현"))
                .andExpect(status().isOk()).andExpect(content().json("{\"available\":false}"));
        mvc.perform(get("/members/nickname/new-name"))
                .andExpect(status().isOk()).andExpect(content().json("{\"available\":true}"));
    }

    @Test
    void emailAvailabilityIsInverseOfExistence() throws Exception {
        when(members.existsByEmail("noco@umc.com")).thenReturn(true);
        mvc.perform(get("/members/email/noco@umc.com"))
                .andExpect(status().isOk()).andExpect(content().json("{\"available\":false}"));
        mvc.perform(get("/members/email/new@umc.com"))
                .andExpect(status().isOk()).andExpect(content().json("{\"available\":true}"));
    }

    @Test
    void ratingsUseResponseDtoAndRepositoryOrder() throws Exception {
        when(members.existsById(1L)).thenReturn(true);
        Rating newer = rating(2L, 155L, 4, null);
        Rating older = rating(1L, 550L, 5, "최고의 영화!");
        when(ratings.findByMember_MemberIdOrderByRatingIdDesc(1L)).thenReturn(List.of(newer, older));
        mvc.perform(get("/members/1/ratings")).andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].ratingId").value(2))
                .andExpect(jsonPath("$[0].movieId").value(155))
                .andExpect(jsonPath("$[0].score").value(4))
                .andExpect(jsonPath("$[0].createdAt").value("2026-10-29T12:00:00"))
                .andExpect(jsonPath("$[0].updatedAt").value("2026-10-29T12:00:00"))
                .andExpect(jsonPath("$[0].member").doesNotExist())
                .andExpect(jsonPath("$[1].ratingId").value(1));
    }

    @Test
    void existingMemberWithNoRatingsReturnsEmptyArray() throws Exception {
        when(members.existsById(3L)).thenReturn(true);
        when(ratings.findByMember_MemberIdOrderByRatingIdDesc(3L)).thenReturn(List.of());
        mvc.perform(get("/members/3/ratings")).andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test
    void missingMemberReturns404WithoutQueryingRatings() throws Exception {
        mvc.perform(get("/members/999/ratings")).andExpect(status().isNotFound());
        verifyNoInteractions(ratings);
    }

    @Test
    void nonNumericMemberIdReturns400() throws Exception {
        mvc.perform(get("/members/abc/ratings")).andExpect(status().isBadRequest());
    }

    @Test
    void corsAllowsFrontendIncludingErrorResponsesAndPreflight() throws Exception {
        mvc.perform(get("/members/999/ratings").header("Origin", "http://localhost:5173"))
                .andExpect(status().isNotFound())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
        mvc.perform(options("/members/1/ratings")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET")
                        .header("Access-Control-Request-Headers", "Content-Type"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    void corsRejectsOtherOrigins() throws Exception {
        mvc.perform(get("/members/nickname/example").header("Origin", "http://localhost:5174"))
                .andExpect(status().isForbidden())
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }

    private Rating rating(Long id, Long movieId, int score, String comment) {
        Rating rating = mock(Rating.class);
        when(rating.getRatingId()).thenReturn(id);
        when(rating.getMovieId()).thenReturn(movieId);
        when(rating.getScore()).thenReturn(score);
        when(rating.getComment()).thenReturn(comment);
        when(rating.getCreatedAt()).thenReturn(LocalDateTime.of(2026, 10, 29, 12, 0));
        when(rating.getUpdatedAt()).thenReturn(LocalDateTime.of(2026, 10, 29, 12, 0));
        return rating;
    }
}
