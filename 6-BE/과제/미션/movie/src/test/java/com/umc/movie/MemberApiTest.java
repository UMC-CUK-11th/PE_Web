package com.umc.movie;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.json.JsonCompareMode;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
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
    @Autowired PasswordEncoder passwordEncoder;

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
        mvc.perform(get("/members/999/ratings")).andExpect(status().isNotFound())
            .andExpect(jsonPath("$.isSuccess").value(false))
            .andExpect(jsonPath("$.code").value("COMMON404"))
            .andExpect(jsonPath("$.message").value("존재하지 않는 유저입니다."));
    }

    @Test
    void signUpStoresBcryptHashAndHidesPassword() throws Exception {
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"umc@example.com\",\"password\":\"Umc!1234\",\"nickname\":\"moviefan\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.isSuccess").value(true))
            .andExpect(jsonPath("$.code").value("COMMON201"))
            .andExpect(jsonPath("$.message").value("회원가입에 성공했습니다."))
            .andExpect(jsonPath("$.result.memberId").isNumber())
            .andExpect(jsonPath("$.result.email").value("umc@example.com"))
            .andExpect(jsonPath("$.result.nickname").value("moviefan"))
            .andExpect(jsonPath("$.result.password").doesNotExist());

        String hash = jdbc.queryForObject("SELECT password FROM member WHERE email = 'umc@example.com'", String.class);
        assertEquals(60, hash.length());
        assertTrue(passwordEncoder.matches("Umc!1234", hash));
    }

    @Test
    void signUpRejectsInvalidInputWith400() throws Exception {
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"not-an-email\",\"password\":\"Umc!1234\",\"nickname\":\"moviefan\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(content().json("{\"isSuccess\":false,\"code\":\"COMMON4001\",\"message\":\"올바른 이메일 형식이 아닙니다.\",\"result\":null}", JsonCompareMode.STRICT));
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"umc@example.com\",\"password\":\"umc12345\",\"nickname\":\"moviefan\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("비밀번호는 대문자/소문자/숫자/특수문자를 포함한 8자 이상이어야 합니다."));
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"umc@example.com\",\"password\":\"Umc!1234\",\"nickname\":\"a\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("닉네임은 2자 이상 12자 이하로 입력해주세요."));
    }

    @Test
    void signUpRejectsDuplicateEmailOrNicknameWith409() throws Exception {
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"noco@umc.com\",\"password\":\"Umc!1234\",\"nickname\":\"새닉네임\"}"))
            .andExpect(status().isConflict())
            .andExpect(content().json("{\"isSuccess\":false,\"code\":\"COMMON4092\",\"message\":\"이미 사용 중인 이메일입니다.\",\"result\":null}", JsonCompareMode.STRICT));
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"new@umc.com\",\"password\":\"Umc!1234\",\"nickname\":\"수현\"}"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.message").value("이미 사용 중인 닉네임입니다."));
    }

    @Test
    void ratingCreateValidatesAndRejectsDuplicates() throws Exception {
        mvc.perform(post("/members/3/ratings").contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":27205,\"score\":5,\"comment\":\"꿈속의 꿈\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.code").value("COMMON201"))
            .andExpect(jsonPath("$.message").value("평점 등록에 성공했습니다."))
            .andExpect(jsonPath("$.result").isNumber());
        mvc.perform(post("/members/3/ratings").contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":27205,\"score\":4}"))
            .andExpect(status().isConflict())
            .andExpect(jsonPath("$.message").value("이미 이 영화에 평점을 남기셨습니다."));
        assertEquals(1, jdbc.queryForObject(
            "SELECT COUNT(*) FROM rating WHERE member_id = 3 AND movie_id = 27205", Integer.class));

        mvc.perform(post("/members/3/ratings").contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":13,\"score\":6}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("별점은 5점 이하여야 합니다."));
        mvc.perform(post("/members/3/ratings").contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":13,\"score\":3,\"comment\":\"" + "가".repeat(501) + "\"}"))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.message").value("후기는 500자 이하로 입력해주세요."));
        mvc.perform(post("/members/999/ratings").contentType(MediaType.APPLICATION_JSON)
                .content("{\"movieId\":13,\"score\":3}"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("존재하지 않는 유저입니다."));
    }

    @Test
    void ratingUpdateChecksOwnerAndExistence() throws Exception {
        mvc.perform(patch("/members/1/ratings/2").contentType(MediaType.APPLICATION_JSON)
                .content("{\"score\":5,\"comment\":\"세 번째 봐도 명작\"}"))
            .andExpect(status().isOk())
            .andExpect(content().json("{\"isSuccess\":true,\"code\":\"COMMON200\",\"message\":\"평점 수정에 성공했습니다.\",\"result\":null}", JsonCompareMode.STRICT));
        mvc.perform(get("/members/1/ratings"))
            .andExpect(jsonPath("$[0].ratingId").value(2))
            .andExpect(jsonPath("$[0].score").value(5))
            .andExpect(jsonPath("$[0].comment").value("세 번째 봐도 명작"));

        mvc.perform(patch("/members/2/ratings/2").contentType(MediaType.APPLICATION_JSON)
                .content("{\"score\":1}"))
            .andExpect(status().isForbidden())
            .andExpect(jsonPath("$.code").value("COMMON403"))
            .andExpect(jsonPath("$.message").value("본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."));
        mvc.perform(patch("/members/1/ratings/999").contentType(MediaType.APPLICATION_JSON)
                .content("{\"score\":1}"))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.message").value("존재하지 않는 평점입니다."));
    }

    @Test
    void ratingDeleteReturns204AndChecksOwner() throws Exception {
        mvc.perform(delete("/members/2/ratings/1"))
            .andExpect(status().isForbidden());
        mvc.perform(delete("/members/1/ratings/1"))
            .andExpect(status().isNoContent())
            .andExpect(content().string(""));
        mvc.perform(get("/members/1/ratings"))
            .andExpect(jsonPath("$.length()").value(1))
            .andExpect(jsonPath("$[0].ratingId").value(2));
        mvc.perform(delete("/members/1/ratings/1"))
            .andExpect(status().isNotFound());
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
        mvc.perform(options("/members/1/ratings/1").header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "DELETE"))
            .andExpect(status().isOk())
            .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
        mvc.perform(get("/members/nickname/{nickname}", "수현").header("Origin", "http://evil.example"))
            .andExpect(status().isForbidden())
            .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}
