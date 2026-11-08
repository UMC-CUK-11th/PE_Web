package com.umc.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class WriteApiIntegrationTests {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired MemberRepository members;
    @Autowired RatingRepository ratings;
    @Autowired PasswordEncoder encoder;

    @BeforeEach
    void clean() {
        ratings.deleteAll();
        members.deleteAll();
    }

    @Test
    void signUpStoresBcryptAndNeverReturnsPassword() throws Exception {
        long memberId = signUp("umc@example.com", "moviefan");
        Member saved = members.findById(memberId).orElseThrow();
        assertEquals(60, saved.getPassword().length());
        assertNotEquals("Umc!1234", saved.getPassword());
        assertTrue(encoder.matches("Umc!1234", saved.getPassword()));
    }

    @Test
    void duplicateEmailAndNicknameHaveDistinctCodes() throws Exception {
        signUp("umc@example.com", "moviefan");
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                        .content(signUpBody("umc@example.com", "Umc!1234", "another")))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("MEMBER4091"))
                .andExpect(jsonPath("$.isSuccess").value(false)).andExpect(jsonPath("$.result").value(org.hamcrest.Matchers.nullValue()));
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                        .content(signUpBody("other@example.com", "Umc!1234", "moviefan")))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("MEMBER4092"));
        assertEquals(1, members.count());
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "{\"email\":\"invalid\",\"password\":\"Umc!1234\",\"nickname\":\"moviefan\"}",
            "{\"email\":\"ok@example.com\",\"password\":\"weak\",\"nickname\":\"moviefan\"}",
            "{\"email\":\"ok@example.com\",\"password\":\"Umc!1234\",\"nickname\":\"x\"}",
            "{\"email\":\"ok@example.com\",\"password\":\"Umc!1234\",\"nickname\":\"1234567890123\"}",
            "{\"email\":\"\",\"password\":\"\",\"nickname\":\"  \"}", "{}", "{"
    })
    void invalidSignUpsReturnCommonErrorWithoutSaving(String body) throws Exception {
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4001"))
                .andExpect(jsonPath("$.message").isNotEmpty()).andExpect(jsonPath("$.password").doesNotExist());
        assertEquals(0, members.count());
    }

    @Test
    void bcryptByteLimitIsBadRequest() throws Exception {
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                        .content(signUpBody("ok@example.com", "Umc!1234" + "가".repeat(22), "moviefan")))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.isSuccess").value(false));
        assertEquals(0, members.count());
    }

    @Test
    void ratingLifecycleAndAllBusinessFailures() throws Exception {
        long owner = signUp("owner@example.com", "owner");
        long other = signUp("other@example.com", "other");
        long rating = createRating(owner, 550);
        mvc.perform(post("/members/{id}/ratings", owner).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.isSuccess").value(false));
        assertEquals(1, ratings.count());

        for (String method : new String[]{"PATCH", "DELETE"}) {
            var forbidden = method.equals("PATCH") ? patch("/members/{id}/ratings/{rating}", other, rating)
                    : delete("/members/{id}/ratings/{rating}", other, rating);
            mvc.perform(forbidden.contentType(MediaType.APPLICATION_JSON).content("{\"score\":2}"))
                    .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("COMMON403"));
            var missing = method.equals("PATCH") ? patch("/members/{id}/ratings/999999", owner)
                    : delete("/members/{id}/ratings/999999", owner);
            mvc.perform(missing.contentType(MediaType.APPLICATION_JSON).content("{\"score\":2}"))
                    .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("COMMON404"));
        }
        assertEquals(5, ratings.findById(rating).orElseThrow().getScore());
        mvc.perform(patch("/members/{id}/ratings/{rating}", owner, rating).contentType(MediaType.APPLICATION_JSON)
                        .content("{\"score\":4,\"comment\":\"수정한 후기\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200"));
        mvc.perform(get("/members/{id}/ratings", owner)).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].score").value(4)).andExpect(jsonPath("$[0].comment").value("수정한 후기"));
        mvc.perform(delete("/members/{id}/ratings/{rating}", owner, rating))
                .andExpect(status().isNoContent()).andExpect(content().string(""));
        mvc.perform(get("/members/{id}/ratings", owner)).andExpect(content().json("[]"));
        assertEquals(0, ratings.count());
    }

    @ParameterizedTest
    @ValueSource(strings = {"{}", "{\"movieId\":550}", "{\"movieId\":0,\"score\":3}",
            "{\"movieId\":-1,\"score\":3}", "{\"movieId\":550,\"score\":0}",
            "{\"movieId\":550,\"score\":6}", "{\"movieId\":550,\"score\":1.5}",
            "{\"movieId\":550.5,\"score\":3}", "{\"movieId\":550,\"score\":null}"})
    void invalidRatingInputIs400(String body) throws Exception {
        mvc.perform(post("/members/1/ratings").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON4001"));
        assertEquals(0, ratings.count());
    }

    @Test
    void commentLengthAndPatchRequiredScoreAreValidated() throws Exception {
        String body = json.writeValueAsString(Map.of("movieId", 550, "score", 5, "comment", "a".repeat(501)));
        mvc.perform(post("/members/1/ratings").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
        mvc.perform(patch("/members/1/ratings/1").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isBadRequest());
        mvc.perform(patch("/members/1/ratings/1").contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isBadRequest());
        long owner = signUp("owner@example.com", "owner");
        mvc.perform(post("/members/{id}/ratings", owner).contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(Map.of("movieId", 550, "score", 1, "comment", "a".repeat(500)))))
                .andExpect(status().isCreated());
    }

    @Test
    void missingMemberOnCreateIs404() throws Exception {
        mvc.perform(post("/members/999999/ratings").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"movieId\":550,\"score\":5}"))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("COMMON404"));
    }

    @Test
    void databaseUniqueAndForeignKeyConstraintsWorkWithoutServiceChecks() throws Exception {
        long owner = signUp("owner@example.com", "owner");
        createRating(owner, 550);
        Member member = members.findById(owner).orElseThrow();
        assertThrows(DataIntegrityViolationException.class, () -> members.saveAndFlush(
                new Member(member.getEmail(), member.getPassword(), "another")));
        assertThrows(DataIntegrityViolationException.class, () -> members.saveAndFlush(
                new Member("another@example.com", member.getPassword(), member.getNickname())));
        assertThrows(DataIntegrityViolationException.class, () -> ratings.saveAndFlush(
                new com.umc.movie.entity.Rating(member, 550L, 4, null)));
        assertThrows(DataIntegrityViolationException.class, () -> members.deleteById(owner));
        assertEquals(1, members.count());
        assertEquals(1, ratings.count());
    }

    private long signUp(String email, String nickname) throws Exception {
        MvcResult result = mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                        .content(signUpBody(email, "Umc!1234", nickname)))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.password").doesNotExist()).andReturn();
        return read(result).path("result").path("memberId").asLong();
    }

    private long createRating(long member, long movie) throws Exception {
        MvcResult result = mvc.perform(post("/members/{id}/ratings", member).contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(Map.of("movieId", movie, "score", 5))))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201")).andReturn();
        return read(result).path("result").asLong();
    }

    private String signUpBody(String email, String password, String nickname) throws Exception {
        return json.writeValueAsString(Map.of("email", email, "password", password, "nickname", nickname));
    }

    private JsonNode read(MvcResult result) throws Exception {
        return json.readTree(result.getResponse().getContentAsByteArray());
    }
}
