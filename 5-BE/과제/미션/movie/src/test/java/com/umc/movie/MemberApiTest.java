package com.umc.movie;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.json.JsonCompareMode;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:mysql://127.0.0.1:3307/umc_movie_test?connectionTimeZone=Asia/Seoul&createDatabaseIfNotExist=true",
    "spring.sql.init.mode=always",
    "spring.sql.init.schema-locations=classpath:test-schema.sql"
})
@AutoConfigureMockMvc
@Transactional
class MemberApiTest {
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;

    @BeforeEach
    void seed() {
        jdbc.update("INSERT INTO member (member_id, email, password, nickname) VALUES "
            + "(1, 'noco@umc.com', '$2a$10$dummyEncodedPasswordValue', '수현'), "
            + "(2, 'minseo@umc.com', '$2a$10$dummyEncodedPasswordValue', '민서'), "
            + "(3, 'empty@umc.com', '$2a$10$dummyEncodedPasswordValue', '평점없음')");
        jdbc.update("INSERT INTO rating (rating_id, member_id, movie_id, score, comment) VALUES "
            + "(1, 1, 550, 5, '최고의 영화!'), (2, 1, 155, 4, '다시 봐도 명작'), (3, 2, 550, 3, '호불호가 갈릴 것 같아요')");
    }

    @Test
    void nicknameCheckReturnsAvailability() throws Exception {
        mvc.perform(get("/members/nickname/{nickname}", "수현"))
            .andExpect(status().isOk()).andExpect(content().json("{\"available\":false}", JsonCompareMode.STRICT));
        mvc.perform(get("/members/nickname/{nickname}", "새닉네임"))
            .andExpect(status().isOk()).andExpect(content().json("{\"available\":true}", JsonCompareMode.STRICT));
    }

    @Test
    void emailCheckKeepsTheWholeAddressIncludingDomain() throws Exception {
        mvc.perform(get("/members/email/noco@umc.com"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.available").value(false));
        mvc.perform(get("/members/email/noco@umc"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.available").value(true));
        mvc.perform(get("/members/email/new@umc.com"))
            .andExpect(status().isOk()).andExpect(jsonPath("$.available").value(true));
    }

    @Test
    void ratingsAreNewestFirstAndOnlyExposeDtoFields() throws Exception {
        mvc.perform(get("/members/1/ratings")).andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].ratingId").value(2))
            .andExpect(jsonPath("$[0].movieId").value(155))
            .andExpect(jsonPath("$[0].score").value(4))
            .andExpect(jsonPath("$[0].comment").value("다시 봐도 명작"))
            .andExpect(jsonPath("$[0].createdAt").isString())
            .andExpect(jsonPath("$[0].updatedAt").isString())
            .andExpect(jsonPath("$[0].member").doesNotExist())
            .andExpect(jsonPath("$[0].member_id").doesNotExist())
            .andExpect(jsonPath("$[1].ratingId").value(1));
    }

    @Test
    void memberWithoutRatingsGetsEmptyArray() throws Exception {
        mvc.perform(get("/members/3/ratings"))
            .andExpect(status().isOk()).andExpect(content().json("[]"));
    }

    @Test
    void unknownMemberReturns404() throws Exception {
        mvc.perform(get("/members/999/ratings")).andExpect(status().isNotFound());
    }

    @Test
    void corsAllowsOnlyTheFrontendOrigin() throws Exception {
        mvc.perform(get("/members/nickname/{nickname}", "수현").header("Origin", "http://localhost:5173"))
            .andExpect(status().isOk())
            .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
        mvc.perform(options("/members/1/ratings").header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "GET"))
            .andExpect(status().isOk())
            .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
        mvc.perform(get("/members/nickname/{nickname}", "수현").header("Origin", "http://evil.example"))
            .andExpect(status().isForbidden())
            .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
