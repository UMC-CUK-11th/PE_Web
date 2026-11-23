package com.umc.movie;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FavoriteMovieRecordApiTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper json;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @MockitoSpyBean
    private FavoriteRepository favoriteRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Value("${jwt.secret}")
    private String jwtSecret;

    private Member owner;
    private Member other;
    private String token;
    private String otherToken;

    @BeforeEach
    void setUp() {
        favoriteRepository.deleteAllInBatch();
        ratingRepository.deleteAllInBatch();
        memberRepository.deleteAllInBatch();
        owner = memberRepository.save(Member.builder()
                .email("owner@example.com").nickname("owner").password("test-hash").build());
        other = memberRepository.save(Member.builder()
                .email("other@example.com").nickname("other").password("test-hash").build());
        token = jwtUtil.createAccessToken(owner.getMemberId(), owner.getEmail());
        otherToken = jwtUtil.createAccessToken(other.getMemberId(), other.getEmail());
    }

    @Test
    void allFiveEndpointsRequireAToken() throws Exception {
        List<MockHttpServletRequestBuilder> requests = List.of(
                post("/favorites").contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550}"),
                get("/favorites"),
                get("/favorites/550"),
                delete("/favorites/550"),
                post("/movie-records").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5,\"addToFavorites\":true}"));

        for (MockHttpServletRequestBuilder request : requests) {
            assertError(mvc.perform(request), 401, "AUTH401_2");
        }
        assertThat(favoriteRepository.count()).isZero();
        assertThat(ratingRepository.count()).isZero();
    }

    @Test
    void invalidAndExpiredTokensAreRejected() throws Exception {
        assertError(mvc.perform(get("/favorites").header("Authorization", "Bearer invalid")),
                401, "AUTH401_3");
        String expired = new JwtUtil(jwtSecret, -120L)
                .createAccessToken(owner.getMemberId(), owner.getEmail());
        assertError(mvc.perform(get("/favorites").header("Authorization", "Bearer " + expired)),
                401, "AUTH401_4");
        String forged = new JwtUtil("another-signing-key-with-at-least-32-bytes", 3600L)
                .createAccessToken(owner.getMemberId(), owner.getEmail());
        assertError(mvc.perform(get("/favorites").header("Authorization", "Bearer " + forged)),
                401, "AUTH401_3");
    }

    @Test
    void favoriteCanBeCreatedListedCheckedAndDeleted() throws Exception {
        perform(get("/favorites/550")).andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(false));
        perform(get("/favorites")).andExpect(status().isOk())
                .andExpect(jsonPath("$.result").isEmpty());

        perform(post("/favorites"), Map.of("movieId", 550))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550))
                .andExpect(jsonPath("$.result.favoriteId").isNumber())
                .andExpect(jsonPath("$.result.createdAt").isNotEmpty());
        perform(post("/favorites"), Map.of("movieId", 551)).andExpect(status().isCreated());
        perform(get("/favorites")).andExpect(status().isOk())
                .andExpect(jsonPath("$.result.length()").value(2))
                .andExpect(jsonPath("$.result[0].movieId").value(551))
                .andExpect(jsonPath("$.result[1].movieId").value(550));
        perform(get("/favorites/550")).andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(true));
        perform(delete("/favorites/550")).andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").value(nullValue()));
        perform(get("/favorites/550")).andExpect(status().isOk())
                .andExpect(jsonPath("$.result.isFavorite").value(false));
        assertError(perform(delete("/favorites/550")), 404, "FAVORITE404_1");
    }

    @Test
    void favoriteReadsAndDeletesAreScopedToTokenMember() throws Exception {
        perform(post("/favorites"), Map.of("movieId", 550)).andExpect(status().isCreated());
        mvc.perform(get("/favorites").header("Authorization", "Bearer " + otherToken)
                        .param("memberId", owner.getMemberId().toString()))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result").isEmpty());
        mvc.perform(get("/favorites/550").header("Authorization", "Bearer " + otherToken))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(false));
        assertError(mvc.perform(delete("/favorites/550")
                .header("Authorization", "Bearer " + otherToken)), 404, "FAVORITE404_1");

        mvc.perform(post("/favorites").header("Authorization", "Bearer " + otherToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(Map.of("movieId", 550, "memberId", owner.getMemberId()))))
                .andExpect(status().isCreated());
        assertThat(favoriteRepository.existsByMember_MemberIdAndMovieId(owner.getMemberId(), 550L)).isTrue();
        assertThat(favoriteRepository.existsByMember_MemberIdAndMovieId(other.getMemberId(), 550L)).isTrue();
    }

    @Test
    void duplicateFavoriteReturnsSpecifiedCodeAndDoesNotInsert() throws Exception {
        perform(post("/favorites"), Map.of("movieId", 550)).andExpect(status().isCreated());
        assertError(perform(post("/favorites"), Map.of("movieId", 550)), 409, "FAVORITE409_1");
        assertThat(favoriteRepository.count()).isEqualTo(1);
    }

    @Test
    void duplicateFavoriteDetectedByDatabaseReturnsSpecifiedCode() throws Exception {
        favoriteRepository.saveAndFlush(Favorite.builder().member(owner).movieId(550L).build());
        doReturn(false).when(favoriteRepository)
                .existsByMember_MemberIdAndMovieId(owner.getMemberId(), 550L);

        assertError(perform(post("/favorites"), Map.of("movieId", 550)), 409, "FAVORITE409_1");
        assertThat(favoriteRepository.count()).isEqualTo(1);
    }

    @Test
    void invalidFavoriteBodyAndMoviePathReturn400() throws Exception {
        for (Object movieId : List.of(0, -1, "invalid")) {
            assertError(perform(post("/favorites"), Map.of("movieId", movieId)), 400, "COMMON4001");
        }
        assertError(perform(post("/favorites"), Map.of()), 400, "COMMON4001");
        for (String movieId : List.of("0", "-1", "invalid")) {
            assertError(perform(get("/favorites/" + movieId)), 400, "COMMON4001");
            assertError(perform(delete("/favorites/" + movieId)), 400, "COMMON4001");
        }
        assertThat(favoriteRepository.count()).isZero();
    }

    @Test
    void movieRecordWithFavoriteSavesBothForTokenMember() throws Exception {
        perform(post("/movie-records"), Map.of(
                "movieId", 550, "score", 5, "comment", "good", "addToFavorites", true))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.result.rating.movieId").value(550))
                .andExpect(jsonPath("$.result.rating.score").value(5))
                .andExpect(jsonPath("$.result.favorite.movieId").value(550));
        assertThat(ratingRepository.existsByMember_MemberIdAndMovieId(owner.getMemberId(), 550L)).isTrue();
        assertThat(favoriteRepository.existsByMember_MemberIdAndMovieId(owner.getMemberId(), 550L)).isTrue();
        assertThat(ratingRepository.existsByMember_MemberIdAndMovieId(other.getMemberId(), 550L)).isFalse();
    }

    @Test
    void movieRecordWithoutFavoriteSavesOnlyRating() throws Exception {
        perform(post("/movie-records"), Map.of("movieId", 550, "score", 4, "addToFavorites", false))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.result.rating.movieId").value(550))
                .andExpect(jsonPath("$.result.favorite").value(nullValue()));
        assertThat(ratingRepository.count()).isEqualTo(1);
        assertThat(favoriteRepository.count()).isZero();
    }

    @Test
    void favoriteConflictRollsBackPreviouslyInsertedRating() throws Exception {
        favoriteRepository.saveAndFlush(Favorite.builder().member(owner).movieId(550L).build());
        assertError(perform(post("/movie-records"), Map.of(
                "movieId", 550, "score", 5, "addToFavorites", true)), 409, "FAVORITE409_1");
        assertThat(ratingRepository.count()).isZero();
        assertThat(favoriteRepository.count()).isEqualTo(1);
    }

    @Test
    void databaseConflictOnSecondSaveAlsoRollsBackRating() throws Exception {
        favoriteRepository.saveAndFlush(Favorite.builder().member(owner).movieId(550L).build());
        doReturn(false).when(favoriteRepository)
                .existsByMember_MemberIdAndMovieId(owner.getMemberId(), 550L);

        assertError(perform(post("/movie-records"), Map.of(
                "movieId", 550, "score", 5, "addToFavorites", true)), 409, "FAVORITE409_1");
        assertThat(ratingRepository.count()).isZero();
        assertThat(favoriteRepository.count()).isEqualTo(1);
    }

    @Test
    void duplicateRatingDoesNotCreateFavorite() throws Exception {
        perform(post("/movie-records"), Map.of("movieId", 550, "score", 4, "addToFavorites", false))
                .andExpect(status().isCreated());
        assertError(perform(post("/movie-records"), Map.of(
                "movieId", 550, "score", 5, "addToFavorites", true)), 409, "RATING409_1");
        assertThat(ratingRepository.count()).isEqualTo(1);
        assertThat(favoriteRepository.count()).isZero();
    }

    @Test
    void movieRecordRejectsInvalidInputBeforeAnySave() throws Exception {
        for (Object score : List.of(0, 6, 3.5, "invalid")) {
            assertError(perform(post("/movie-records"), Map.of(
                    "movieId", 550, "score", score, "addToFavorites", true)), 400, "COMMON4001");
        }
        assertError(perform(post("/movie-records"), Map.of("movieId", 550, "addToFavorites", true)),
                400, "COMMON4001");
        assertError(perform(post("/movie-records"), Map.of("movieId", 550, "score", 5)),
                400, "COMMON4001");
        assertError(perform(post("/movie-records"), Map.of(
                "movieId", 0, "score", 5, "addToFavorites", true)), 400, "COMMON4001");
        assertError(perform(post("/movie-records"), Map.of(
                "movieId", 550, "score", 5, "comment", "x".repeat(501), "addToFavorites", true)),
                400, "COMMON4001");
        assertThat(ratingRepository.count()).isZero();
        assertThat(favoriteRepository.count()).isZero();
    }

    private ResultActions perform(MockHttpServletRequestBuilder request) throws Exception {
        return mvc.perform(request.header("Authorization", "Bearer " + token));
    }

    private ResultActions perform(MockHttpServletRequestBuilder request, Map<String, ?> body) throws Exception {
        return perform(request.contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(body)));
    }

    private void assertError(ResultActions response, int status, String code) throws Exception {
        response.andExpect(status().is(status))
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value(code))
                .andExpect(jsonPath("$.message").isString())
                .andExpect(jsonPath("$.result").value(nullValue()));
    }
}
