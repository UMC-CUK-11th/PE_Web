package com.umc.movie;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.Favorite;
import com.umc.movie.repository.*;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest @AutoConfigureMockMvc @ActiveProfiles("test")
class FavoriteApiIntegrationTests {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired FavoriteRepository favorites;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @Autowired JwtUtil jwt;
    @BeforeEach @AfterEach void clean() { favorites.deleteAll(); ratings.deleteAll(); members.deleteAll(); }

    private long signup() throws Exception {
        var result = mvc.perform(post("/members").contentType("application/json").content("{\"email\":\"favorite@example.com\",\"password\":\"Umc!1234\",\"nickname\":\"favorite\"}"))
                .andExpect(status().isCreated()).andReturn();
        return json.readTree(result.getResponse().getContentAsByteArray()).at("/result/memberId").asLong();
    }
    private String token(long id) { return "Bearer " + jwt.createAccessToken(id, "favorite@example.com"); }

    @Test
    @DisplayName("토큰 없이 즐겨찾기를 등록하면 401 AUTH401_2를 반환하고 저장하지 않는다")
    void favoriteCreationRequiresToken() throws Exception {
        mvc.perform(post("/favorites").contentType("application/json").content("{\"movieId\":550}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
        assertEquals(0, favorites.count());
    }

    @Test
    @DisplayName("발급된 토큰으로 즐겨찾기를 등록하면 201 COMMON201을 반환하고 저장한다")
    void createsFavoriteWithToken() throws Exception {
        long memberId = signup();
        mvc.perform(post("/favorites").header("Authorization", token(memberId))
                        .contentType("application/json").content("{\"movieId\":550}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550));
        assertTrue(favorites.existsByMember_MemberIdAndMovieId(memberId, 550L));
    }

    @Test
    @DisplayName("즐겨찾기한 영화를 다시 등록하면 409 FAVORITE409_1을 반환한다")
    void rejectsDuplicateFavorite() throws Exception {
        long memberId = signup();
        favorites.saveAndFlush(new Favorite(members.findById(memberId).orElseThrow(), 550L));
        mvc.perform(post("/favorites").header("Authorization", token(memberId))
                        .contentType("application/json").content("{\"movieId\":550}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        assertEquals(1, favorites.count());
    }

    @Test
    @DisplayName("즐겨찾기하지 않은 영화는 200과 isFavorite false를 반환한다")
    void returnsFalseForUnsavedFavorite() throws Exception {
        mvc.perform(get("/favorites/550").header("Authorization", token(signup())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(false));
    }

    @Test void authenticationRequiredForEveryFavoriteEndpoint() throws Exception {
        mvc.perform(get("/favorites")).andExpect(status().isUnauthorized());
        mvc.perform(get("/favorites/550")).andExpect(status().isUnauthorized());
        mvc.perform(post("/favorites").contentType("application/json").content("{\"movieId\":550}")).andExpect(status().isUnauthorized());
        mvc.perform(delete("/favorites/550")).andExpect(status().isUnauthorized());
    }
    @Test void lifecycleAndMemberIsolation() throws Exception {
        long id = signup(); String a = token(id);
        var other = members.saveAndFlush(new com.umc.movie.entity.Member("other@example.com", "unused", "other"));
        String b = "Bearer " + jwt.createAccessToken(other.getMemberId(), other.getEmail());
        mvc.perform(get("/members/me").header("Authorization", a))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.email").value("favorite@example.com"));
        mvc.perform(get("/favorites/550").header("Authorization", a)).andExpect(jsonPath("$.result.isFavorite").value(false));
        mvc.perform(post("/favorites").header("Authorization", a).contentType("application/json").content("{\"movieId\":550}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result.movieId").value(550));
        mvc.perform(get("/favorites").header("Authorization", a)).andExpect(jsonPath("$.result.length()").value(1));
        mvc.perform(get("/favorites").header("Authorization", b)).andExpect(jsonPath("$.result.length()").value(0));
        mvc.perform(get("/favorites/550").header("Authorization", b)).andExpect(jsonPath("$.result.isFavorite").value(false));
        mvc.perform(delete("/favorites/550").header("Authorization", b)).andExpect(status().isNotFound());
        assertEquals(1, favorites.count());
        mvc.perform(delete("/favorites/550").header("Authorization", a)).andExpect(status().isOk());
        mvc.perform(get("/favorites/550").header("Authorization", a)).andExpect(jsonPath("$.result.isFavorite").value(false));
        assertEquals(0, favorites.count());
    }
    @ParameterizedTest @ValueSource(strings = {"{}", "{\"movieId\":0}", "{\"movieId\":-1}", "{\"movieId\":1.5}"})
    void invalidMovieIdsAreRejected(String body) throws Exception {
        mvc.perform(post("/favorites").header("Authorization", token(signup())).contentType("application/json").content(body)).andExpect(status().isBadRequest());
        assertEquals(0, favorites.count());
    }
    @Test void dbUniqueConstraintAndForeignKeyAreReal() throws Exception {
        long id = signup(); var member = members.findById(id).orElseThrow();
        favorites.saveAndFlush(new Favorite(member, 550L));
        assertThrows(DataIntegrityViolationException.class, () -> favorites.saveAndFlush(new Favorite(member, 550L)));
        assertThrows(DataIntegrityViolationException.class, () -> members.deleteById(id));
        assertEquals(1, favorites.count());
    }
}
