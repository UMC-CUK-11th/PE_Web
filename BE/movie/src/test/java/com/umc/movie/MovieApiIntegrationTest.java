package com.umc.movie;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:movie-test;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.username=sa", "spring.datasource.password=",
        "spring.datasource.driver-class-name=org.h2.Driver", "spring.jpa.hibernate.ddl-auto=create-drop",
        "jwt.secret=integration-test-key-only-0123456789-abcdef", "jwt.access-expiration=3600",
        "debug=false", "logging.level.root=WARN"
})
@AutoConfigureMockMvc
@Transactional
class MovieApiIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;
    @Autowired MemberRepository members;
    @Autowired PasswordEncoder encoder;
    @Autowired JwtUtil jwt;
    static final String PASSWORD = "Umcine123!";

    String body(Object value) throws Exception { return json.writeValueAsString(value); }
    Member member(String name) {
        return members.saveAndFlush(new Member(name + "@example.com", encoder.encode(PASSWORD), name));
    }
    String bearer(Member member) { return "Bearer " + jwt.createAccessToken(member.getMemberId(), member.getEmail()); }

    @Test
    void signUpHashesPasswordAndRejectsDuplicates() throws Exception {
        String request = body(Map.of("email", "signup@example.com", "nickname", "가입테스트", "password", PASSWORD));
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.result.email").value("signup@example.com"))
                .andExpect(jsonPath("$.result.password").doesNotExist());
        Member saved = members.findAll().stream().filter(m -> m.getEmail().equals("signup@example.com")).findFirst().orElseThrow();
        assertThat(saved.getPassword()).hasSize(60).isNotEqualTo(PASSWORD);
        assertThat(encoder.matches(PASSWORD, saved.getPassword())).isTrue();
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON).content(request))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.result").isEmpty());
        assertThat(members.count()).isEqualTo(1);
    }

    @Test
    void invalidSignUpExplainsValidationFailure() throws Exception {
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("email", "bad-email", "nickname", "가", "password", "weak"))))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.message").isNotEmpty());
        assertThat(members.count()).isZero();
    }

    @Test
    void ratingLifecycleChecksValidationOwnershipAndDeletion() throws Exception {
        Member owner = member("owner");
        Member other = member("other");
        String collection = "/ratings";
        String publicCollection = "/members/" + owner.getMemberId() + "/ratings";
        String created = mvc.perform(post(collection).header("Authorization", bearer(owner)).contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("movieId", 550, "score", 5, "comment", "좋아요"))))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        long ratingId = json.readTree(created).get("result").get("ratingId").asLong();
        String rating = collection + "/" + ratingId;
        mvc.perform(get(publicCollection)).andExpect(status().isOk()).andExpect(jsonPath("$[0].score").value(5));
        mvc.perform(post(collection).header("Authorization", bearer(owner)).contentType(MediaType.APPLICATION_JSON).content(body(Map.of("movieId", 550, "score", 4))))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
        mvc.perform(post(collection).header("Authorization", bearer(owner)).contentType(MediaType.APPLICATION_JSON).content(body(Map.of("movieId", 155, "score", 6))))
                .andExpect(status().isBadRequest());
        mvc.perform(post(collection).header("Authorization", bearer(owner)).contentType(MediaType.APPLICATION_JSON).content(body(Map.of("movieId", 155, "score", 2.5))))
                .andExpect(status().isBadRequest());
        mvc.perform(patch(rating).header("Authorization", bearer(other))
                        .contentType(MediaType.APPLICATION_JSON).content(body(Map.of("score", 4))))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("RATING403_1"));
        mvc.perform(delete(rating).header("Authorization", bearer(other))).andExpect(status().isForbidden());
        mvc.perform(patch(collection + "/999999999").header("Authorization", bearer(owner)).contentType(MediaType.APPLICATION_JSON).content(body(Map.of("score", 4))))
                .andExpect(status().isNotFound());
        mvc.perform(delete(collection + "/999999999").header("Authorization", bearer(owner))).andExpect(status().isNotFound());
        mvc.perform(patch(rating).header("Authorization", bearer(owner)).contentType(MediaType.APPLICATION_JSON).content(body(Map.of("score", 4, "comment", "수정"))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.score").value(4));
        mvc.perform(get(publicCollection)).andExpect(jsonPath("$[0].score").value(4)).andExpect(jsonPath("$[0].comment").value("수정"));
        mvc.perform(delete(rating).header("Authorization", bearer(owner))).andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("COMMON200")).andExpect(jsonPath("$.result").isEmpty());
        mvc.perform(get(publicCollection)).andExpect(content().json("[]"));
    }

    @Test
    void missingMemberReturns404AndMalformedJsonReturns400() throws Exception {
        mvc.perform(get("/members/999999999/ratings")).andExpect(status().isNotFound());
        mvc.perform(post("/ratings").header("Authorization", "Bearer " + jwt.createAccessToken(999999999L, "missing@example.com"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("movieId", 550, "score", 5))))
                .andExpect(status().isNotFound());
        mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON).content("{"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.isSuccess").value(false));
    }

    @Test
    void corsAllowsOnlyLocalFrontendOrigins() throws Exception {
        mvc.perform(options("/members").header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "POST").header("Access-Control-Request-Headers", "content-type"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
        mvc.perform(get("/members/nickname/check").header("Origin", "https://untrusted.example"))
                .andExpect(status().isForbidden());
    }
}
