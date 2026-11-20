package com.umc.movie;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.entity.Favorite;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.service.MemberService;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;
import java.util.UUID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:favorite-test;MODE=MySQL;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FavoriteIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired MemberService members;
    @Autowired JwtUtil jwt;
    @Autowired JdbcTemplate jdbc;
    @Autowired ObjectMapper mapper;
    @MockitoSpyBean FavoriteRepository favorites;
    Long memberId;
    Long otherId;
    String token;
    String otherToken;

    @BeforeEach void prepare() {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        var member = members.signUp(new SignUpRequest(suffix + "@umc.com", "Umc1234!", "회원" + suffix));
        var other = members.signUp(new SignUpRequest("b" + suffix + "@umc.com", "Umc1234!", "다른" + suffix));
        memberId = member.memberId();
        otherId = other.memberId();
        token = "Bearer " + jwt.createAccessToken(memberId, member.email());
        otherToken = "Bearer " + jwt.createAccessToken(otherId, other.email());
    }

    @AfterEach void clean() {
        for (Long id : new Long[]{memberId, otherId}) {
            jdbc.update("DELETE FROM favorite WHERE member_id=?", id);
            jdbc.update("DELETE FROM rating WHERE member_id=?", id);
            jdbc.update("DELETE FROM member WHERE member_id=?", id);
        }
    }

    @Test void favoritesLifecycleAndMemberIsolation() throws Exception {
        mvc.perform(get("/favorites/550").header("Authorization", token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(false));
        for (int movieId : new int[]{550, 155}) {
            mvc.perform(post("/favorites").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                    .content("{\"movieId\":" + movieId + "}"))
                    .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201"))
                    .andExpect(jsonPath("$.result.createdAt").exists());
        }
        mvc.perform(post("/favorites").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        mvc.perform(get("/favorites").header("Authorization", token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.length()").value(2))
                .andExpect(jsonPath("$.result[0].movieId").value(155))
                .andExpect(jsonPath("$.result[1].movieId").value(550))
                .andExpect(jsonPath("$.result[0].member").doesNotExist());
        mvc.perform(get("/favorites").header("Authorization", otherToken))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result").isEmpty());
        mvc.perform(get("/favorites/550").header("Authorization", token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(true));
        mvc.perform(delete("/favorites/550").header("Authorization", otherToken))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("FAVORITE404_1"));
        mvc.perform(delete("/favorites/550").header("Authorization", token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").isEmpty());
        mvc.perform(get("/favorites/550").header("Authorization", token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.isFavorite").value(false));
        mvc.perform(delete("/favorites/550").header("Authorization", token))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("FAVORITE404_1"));
    }

    @Test void movieRecordCommitsBothOrOnlyRating() throws Exception {
        mvc.perform(post("/movie-records").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550,\"score\":5,\"comment\":\"좋아요\",\"addToFavorites\":true}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result.rating.movieId").value(550))
                .andExpect(jsonPath("$.result.favorite.movieId").value(550));
        assertThat(count("rating", 550)).isEqualTo(1);
        assertThat(count("favorite", 550)).isEqualTo(1);
        mvc.perform(post("/movie-records").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":155,\"score\":4,\"addToFavorites\":false}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result.favorite").isEmpty());
        assertThat(count("rating", 155)).isEqualTo(1);
        assertThat(count("favorite", 155)).isZero();
        mvc.perform(post("/movie-records").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550,\"score\":4,\"addToFavorites\":true}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
    }

    @Test void duplicateFavoriteDoesNotLeaveRating() throws Exception {
        mvc.perform(post("/favorites").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550}")).andExpect(status().isCreated());
        mvc.perform(post("/movie-records").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550,\"score\":5,\"addToFavorites\":true}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        assertThat(count("rating", 550)).isZero();
        assertThat(count("favorite", 550)).isEqualTo(1);
    }

    @Test void failureDuringSecondSaveRollsBackFirstSave() throws Exception {
        // 첫 번째 rating INSERT 이후 두 번째 저장에 런타임 예외를 발생시킨다.
        doThrow(new IllegalArgumentException("테스트용 두 번째 저장 실패"))
                .when(favorites).save(any(Favorite.class));
        mvc.perform(post("/movie-records").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550,\"score\":5,\"addToFavorites\":true}"))
                .andExpect(status().isConflict());
        // 테스트 자체에 @Transactional이 없어 서비스 롤백 결과를 별도 연결에서 확인한다.
        assertThat(count("rating", 550)).isZero();
        assertThat(count("favorite", 550)).isZero();
    }

    @Test void authenticationAndValidation() throws Exception {
        mvc.perform(get("/favorites")).andExpect(status().isUnauthorized());
        mvc.perform(post("/movie-records").contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550,\"score\":5,\"addToFavorites\":true}"))
                .andExpect(status().isUnauthorized());
        mvc.perform(post("/favorites").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":0}")).andExpect(status().isBadRequest());
        mvc.perform(post("/movie-records").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550,\"score\":6,\"addToFavorites\":true}"))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/movie-records").header("Authorization", token).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550,\"score\":5}"))
                .andExpect(status().isBadRequest());
    }

    private int count(String table, int movieId) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM " + table + " WHERE member_id=? AND movie_id=?",
                Integer.class, memberId, movieId);
    }
}
