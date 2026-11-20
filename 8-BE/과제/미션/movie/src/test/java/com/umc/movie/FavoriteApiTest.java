package com.umc.movie;

import com.umc.movie.util.JwtUtil;
import jakarta.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.json.JsonCompareMode;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:mysql://127.0.0.1:3307/umc_movie_test?connectionTimeZone=Asia/Seoul&createDatabaseIfNotExist=true",
    "spring.sql.init.mode=always",
    "spring.sql.init.schema-locations=classpath:test-schema.sql",
    "jwt.secret=" + MemberApiTest.SECRET,
    "jwt.access-expiration=3600"
})
@AutoConfigureMockMvc
@Transactional
class FavoriteApiTest {

    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;
    @Autowired JwtUtil jwtUtil;
    @Autowired EntityManager em;

    String bearer(long memberId) {
        return "Bearer " + jwtUtil.createAccessToken(memberId, "member" + memberId + "@umc.com");
    }

    @BeforeEach
    void seed() {
        jdbc.update("INSERT INTO member (member_id, email, password, nickname) VALUES "
            + "(1, 'noco@umc.com', '$2a$10$dummyEncodedPasswordValue', '수현'), "
            + "(2, 'minseo@umc.com', '$2a$10$dummyEncodedPasswordValue', '민서')");
        jdbc.update("INSERT INTO rating (rating_id, member_id, movie_id, score, comment) VALUES (1, 1, 155, 4, '다시 봐도 명작')");
    }

    @Test
    void favoriteLifecycleUsesOnlyTheTokenOwner() throws Exception {
        mvc.perform(get("/favorites").header("Authorization", bearer(1)))
            .andExpect(status().isOk())
            .andExpect(content().json("{\"isSuccess\":true,\"code\":\"COMMON200\",\"message\":\"내 즐겨찾기 목록을 조회했습니다.\",\"result\":[]}", JsonCompareMode.STRICT));
        mvc.perform(get("/favorites/550").header("Authorization", bearer(1)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.result.isFavorite").value(false));

        mvc.perform(post("/favorites").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.code").value("COMMON201"))
            .andExpect(jsonPath("$.message").value("즐겨찾기를 등록했습니다."))
            .andExpect(jsonPath("$.result.favoriteId").isNumber())
            .andExpect(jsonPath("$.result.movieId").value(550))
            .andExpect(jsonPath("$.result.createdAt").isString())
            .andExpect(jsonPath("$.result.member").doesNotExist());
        mvc.perform(post("/favorites").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":155}"))
            .andExpect(status().isCreated());
        // 다른 회원의 즐겨찾기는 섞이지 않는다
        mvc.perform(post("/favorites").header("Authorization", bearer(2)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550}"))
            .andExpect(status().isCreated());

        mvc.perform(get("/favorites").header("Authorization", bearer(1)))
            .andExpect(jsonPath("$.result.length()").value(2))
            .andExpect(jsonPath("$.result[0].movieId").value(155))
            .andExpect(jsonPath("$.result[1].movieId").value(550));
        mvc.perform(get("/favorites/550").header("Authorization", bearer(1)))
            .andExpect(content().json("{\"isSuccess\":true,\"code\":\"COMMON200\",\"message\":\"즐겨찾기 여부를 조회했습니다.\",\"result\":{\"isFavorite\":true}}", JsonCompareMode.STRICT));

        mvc.perform(delete("/favorites/550").header("Authorization", bearer(1)))
            .andExpect(status().isOk())
            .andExpect(content().json("{\"isSuccess\":true,\"code\":\"COMMON200\",\"message\":\"즐겨찾기를 해제했습니다.\",\"result\":null}", JsonCompareMode.STRICT));
        mvc.perform(get("/favorites/550").header("Authorization", bearer(1)))
            .andExpect(jsonPath("$.result.isFavorite").value(false));
        mvc.perform(get("/favorites/550").header("Authorization", bearer(2)))
            .andExpect(jsonPath("$.result.isFavorite").value(true));
    }

    @Test
    void favoriteFailuresFollowTheServiceRules() throws Exception {
        mvc.perform(post("/favorites").contentType(MediaType.APPLICATION_JSON).content("{\"movieId\":550}"))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.code").value("AUTH401_2"));

        mvc.perform(post("/favorites").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550}"))
            .andExpect(status().isCreated());
        mvc.perform(post("/favorites").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550}"))
            .andExpect(status().isConflict())
            .andExpect(content().json("{\"isSuccess\":false,\"code\":\"FAVORITE409_1\",\"message\":\"이미 이 영화를 즐겨찾기하셨습니다.\",\"result\":null}", JsonCompareMode.STRICT));

        mvc.perform(delete("/favorites/27205").header("Authorization", bearer(1)))
            .andExpect(status().isNotFound())
            .andExpect(content().json("{\"isSuccess\":false,\"code\":\"FAVORITE404_1\",\"message\":\"즐겨찾기한 영화를 찾을 수 없습니다.\",\"result\":null}", JsonCompareMode.STRICT));

        mvc.perform(post("/favorites").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":0}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("영화 ID는 양수여야 합니다."));
        mvc.perform(post("/favorites").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("영화 ID는 필수입니다."));
        // Postman에서 본문 형식이 바뀌어 본문 없이 보낸 경우
        mvc.perform(post("/movie-records").header("Authorization", bearer(1)))
            .andExpect(status().isBadRequest())
            .andExpect(content().json("{\"isSuccess\":false,\"code\":\"COMMON4002\",\"message\":\"요청 본문을 읽을 수 없습니다.\",\"result\":null}", JsonCompareMode.STRICT));
        mvc.perform(post("/favorites").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.code").value("COMMON4002"));
        mvc.perform(post("/favorites").header("Authorization", bearer(999)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":550}"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.code").value("MEMBER404_1"));
    }

    @Test
    void movieRecordSavesRatingAndFavoriteTogether() throws Exception {
        mvc.perform(post("/movie-records").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":238,\"score\":5,\"comment\":\"다시 보고 싶은 영화입니다.\",\"addToFavorites\":true}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.code").value("COMMON201"))
            .andExpect(jsonPath("$.message").value("영화 기록을 저장했습니다."))
            .andExpect(jsonPath("$.result.rating.movieId").value(238))
            .andExpect(jsonPath("$.result.rating.score").value(5))
            .andExpect(jsonPath("$.result.favorite.movieId").value(238))
            .andExpect(jsonPath("$.result.favorite.favoriteId").isNumber());

        mvc.perform(post("/movie-records").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":13,\"score\":3,\"addToFavorites\":false}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.result.rating.movieId").value(13))
            .andExpect(jsonPath("$.result.favorite").value((Object) null));

        mvc.perform(post("/movie-records").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":238,\"score\":4,\"addToFavorites\":true}"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.code").value("RATING409_1"));
        mvc.perform(post("/movie-records").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":238,\"score\":4}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("즐겨찾기 추가 여부는 필수입니다."));
        mvc.perform(post("/movie-records").contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":238,\"score\":4,\"addToFavorites\":true}"))
            .andExpect(status().isUnauthorized());

        em.flush();
        assertEquals(1, jdbc.queryForObject("SELECT COUNT(*) FROM rating WHERE member_id = 1 AND movie_id = 238", Integer.class));
        assertEquals(1, jdbc.queryForObject("SELECT COUNT(*) FROM favorite WHERE member_id = 1 AND movie_id = 238", Integer.class));
        assertEquals(0, jdbc.queryForObject("SELECT COUNT(*) FROM favorite WHERE member_id = 1 AND movie_id = 13", Integer.class));
    }

    @Test
    void movieRecordRejectsAnAlreadyFavoritedMovieBeforeSavingTheRating() throws Exception {
        mvc.perform(post("/favorites").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":680}"))
            .andExpect(status().isCreated());
        mvc.perform(post("/movie-records").header("Authorization", bearer(1)).contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":680,\"score\":5,\"addToFavorites\":true}"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.code").value("FAVORITE409_1"));
        em.flush();
        assertEquals(0, jdbc.queryForObject("SELECT COUNT(*) FROM rating WHERE member_id = 1 AND movie_id = 680", Integer.class));
    }

    @Test
    void favoriteEndpointsArePreflightFriendly() throws Exception {
        mvc.perform(options("/favorites/550").header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "DELETE")
                .header("Access-Control-Request-Headers", "authorization"))
            .andExpect(status().isOk())
            .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }
}
