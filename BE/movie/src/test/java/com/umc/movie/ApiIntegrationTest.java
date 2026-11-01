package com.umc.movie;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class ApiIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;
    @Test void nicknameAvailability() throws Exception {
        mvc.perform(get("/members/nickname/{nickname}", "수현")).andExpect(status().isOk()).andExpect(jsonPath("$.available").value(false));
        mvc.perform(get("/members/nickname/{nickname}", "새닉네임")).andExpect(status().isOk()).andExpect(jsonPath("$.available").value(true));
    }
    @Test void emailAvailability() throws Exception {
        mvc.perform(get("/members/email/{email}", "noco@umc.com")).andExpect(status().isOk()).andExpect(jsonPath("$.available").value(false));
        mvc.perform(get("/members/email/{email}", "new@umc.com")).andExpect(status().isOk()).andExpect(jsonPath("$.available").value(true));
    }
    @Test void returnsOnlyOwnRatingsNewestFirstAndNoMemberSecrets() throws Exception {
        mvc.perform(get("/members/1/ratings")).andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2)).andExpect(jsonPath("$[0].ratingId").value(2))
                .andExpect(jsonPath("$[0].movieId").value(155)).andExpect(jsonPath("$[0].score").value(4))
                .andExpect(jsonPath("$[1].ratingId").value(1)).andExpect(jsonPath("$[0].createdAt").value("2026-08-27T10:00:00"))
                .andExpect(jsonPath("$[0].updatedAt").exists()).andExpect(jsonPath("$[0].member").doesNotExist())
                .andExpect(jsonPath("$[0].password").doesNotExist()).andExpect(jsonPath("$[0].email").doesNotExist());
    }
    @Test void existingMemberWithoutRatingsIsEmptyArray() throws Exception {
        mvc.perform(get("/members/3/ratings")).andExpect(status().isOk()).andExpect(content().json("[]"));
    }
    @Test void missingMemberIs404() throws Exception { mvc.perform(get("/members/999/ratings")).andExpect(status().isNotFound()); }
    @Test void nonNumericMemberIdIs400() throws Exception {
        mvc.perform(get("/members/abc/ratings")).andExpect(status().isBadRequest());
    }
    @Test void allowedOriginCanReadResponse() throws Exception {
        mvc.perform(get("/members/1/ratings").header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }
    @Test void preflightIsAllowed() throws Exception {
        mvc.perform(options("/members/1/ratings").header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "GET").header("Access-Control-Request-Headers", "content-type"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }
    @Test void otherOriginIsRejected() throws Exception {
        mvc.perform(get("/members/1/ratings").header("Origin", "https://untrusted.example"))
                .andExpect(status().isForbidden()).andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
    @Test void databaseRejectsDuplicateRating() {
        assertThatThrownBy(() -> jdbc.update("INSERT INTO rating(member_id,movie_id,score) VALUES(1,550,3)"))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
    @Test void databaseRejectsInvalidScoreAndUnknownMember() {
        assertThatThrownBy(() -> jdbc.update("INSERT INTO rating(member_id,movie_id,score) VALUES(3,155,6)"))
                .isInstanceOf(DataIntegrityViolationException.class);
        assertThatThrownBy(() -> jdbc.update("INSERT INTO rating(member_id,movie_id,score) VALUES(999,155,3)"))
                .isInstanceOf(DataIntegrityViolationException.class);
    }
}
