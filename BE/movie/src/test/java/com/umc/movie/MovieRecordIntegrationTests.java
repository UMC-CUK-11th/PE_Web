package com.umc.movie;

import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.nullValue;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MovieRecordIntegrationTests {
    @Autowired MockMvc mvc;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @MockitoSpyBean FavoriteRepository favorites;
    @Autowired JwtUtil jwt;

    private Member member;
    private String token;

    @BeforeEach
    void setUp() {
        member = members.saveAndFlush(new Member("record@example.com", "unused", "record-user"));
        token = "Bearer " + jwt.createAccessToken(member.getMemberId(), member.getEmail());
    }

    @AfterEach
    void cleanUp() {
        favorites.deleteAll();
        ratings.deleteAll();
        members.deleteAll();
    }

    @Test
    void savesBothAndRejectsRepeatWithoutAddingRows() throws Exception {
        mvc.perform(record(238, true))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.rating.movieId").value(238))
                .andExpect(jsonPath("$.result.favorite.movieId").value(238));
        mvc.perform(record(238, true))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
        assertEquals(1, ratings.count());
        assertEquals(1, favorites.count());
    }

    @Test
    void falseSavesOnlyRatingEvenWithAnExistingFavorite() throws Exception {
        favorites.saveAndFlush(new Favorite(member, 238L));
        mvc.perform(record(238, false)).andExpect(status().isCreated())
                .andExpect(jsonPath("$.result.favorite").value(nullValue()));
        assertEquals(1, ratings.count());
        assertEquals(1, favorites.count());
    }

    @Test
    @DisplayName("즐겨찾기 중복으로 영화 기록 저장이 실패하면 평점 수와 기존 즐겨찾기를 유지한다")
    void favoriteConflictRollsBackRatingAndPreservesExistingFavorite() throws Exception {
        var existing = favorites.saveAndFlush(new Favorite(member, 238L));
        long previousRatingCount = ratings.count();
        mvc.perform(record(238, true))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        assertEquals(previousRatingCount, ratings.count());
        assertTrue(favorites.existsById(existing.getFavoriteId()));
    }

    @Test
    void actualDatabaseUniqueFailureAfterRatingInsertRollsBackTheRating() throws Exception {
        var existing = favorites.saveAndFlush(new Favorite(member, 238L));
        // Simulate a stale precheck. Both INSERT operations still use the real database.
        doReturn(false).when(favorites).existsByMember_MemberIdAndMovieId(member.getMemberId(), 238L);
        mvc.perform(record(238, true))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("COMMON4091"));
        assertEquals(0, ratings.count());
        assertEquals(1, favorites.count());
        assertTrue(favorites.existsById(existing.getFavoriteId()));
    }

    @Test
    void requiresAuthenticationAndValidInput() throws Exception {
        mvc.perform(post("/movie-records").contentType("application/json")
                        .content("{\"movieId\":238,\"score\":5,\"addToFavorites\":true}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        for (String body : new String[]{"{\"movieId\":238,\"score\":5}", "{\"movieId\":0,\"score\":6,\"addToFavorites\":true}"}) {
            mvc.perform(post("/movie-records").header("Authorization", token).contentType("application/json").content(body))
                    .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON4001"));
        }
        assertEquals(0, ratings.count());
        assertEquals(0, favorites.count());
    }

    private org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder record(long movieId, boolean addToFavorites) {
        return post("/movie-records").header("Authorization", token).contentType("application/json")
                .content("{\"movieId\":%d,\"score\":5,\"addToFavorites\":%s}".formatted(movieId, addToFavorites));
    }
}