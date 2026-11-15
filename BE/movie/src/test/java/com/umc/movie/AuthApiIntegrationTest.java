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
import java.util.Base64;
import java.util.Map;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:auth-test;MODE=MySQL;DB_CLOSE_DELAY=-1",
        "spring.datasource.username=sa", "spring.datasource.password=",
        "spring.datasource.driver-class-name=org.h2.Driver", "spring.jpa.hibernate.ddl-auto=create-drop",
        "jwt.secret=integration-test-key-only-0123456789-abcdef", "jwt.access-expiration=3600",
        "debug=false", "logging.level.root=WARN"
})
@AutoConfigureMockMvc
@Transactional
class AuthApiIntegrationTest {
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
    void loginIssuesSignedTokenAndMyInfoExcludesPassword() throws Exception {
        Member owner = member("loginOwner");
        String response = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("email", owner.getEmail(), "password", PASSWORD))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result.nickname").value(owner.getNickname()))
                .andExpect(jsonPath("$.result.password").doesNotExist()).andReturn().getResponse().getContentAsString();
        String token = json.readTree(response).path("result").path("accessToken").asText();
        assertThat(jwt.getMemberId(token)).isEqualTo(owner.getMemberId());
        var payload = json.readTree(Base64.getUrlDecoder().decode(token.split("\\.")[1]));
        assertThat(payload.path("sub").asText()).isEqualTo(owner.getMemberId().toString());
        assertThat(payload.path("exp").asLong() - payload.path("iat").asLong()).isEqualTo(3600);
        assertThat(payload.has("password")).isFalse();
        mvc.perform(get("/members/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.email").value(owner.getEmail()))
                .andExpect(jsonPath("$.result.createdAt").isNotEmpty()).andExpect(jsonPath("$.result.password").doesNotExist());
    }

    @Test
    void missingEmailAndWrongPasswordHaveIdenticalFailure() throws Exception {
        Member owner = member("failureOwner");
        String wrongPassword = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("email", owner.getEmail(), "password", "wrong"))))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_1"))
                .andReturn().getResponse().getContentAsString();
        mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("email", "missing@example.com", "password", PASSWORD))))
                .andExpect(status().isUnauthorized()).andExpect(content().json(wrongPassword));
        mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("email", owner.getEmail(), "password", "x".repeat(100)))))
                .andExpect(status().isUnauthorized()).andExpect(content().json(wrongPassword));
    }

    @Test
    void missingMalformedAndTamperedTokensFailBeforeController() throws Exception {
        mvc.perform(get("/members/me")).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        mvc.perform(get("/members/me").header("Authorization", "Basic abc"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        mvc.perform(get("/members/me").header("Authorization", "Bearer invalid"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_3"));
        Member owner = member("tamperOwner");
        String[] parts = jwt.createAccessToken(owner.getMemberId(), owner.getEmail()).split("\\.");
        var claims = json.createObjectNode().put("sub", "999999").put("exp", System.currentTimeMillis() / 1000 + 3600);
        parts[1] = Base64.getUrlEncoder().withoutPadding().encodeToString(json.writeValueAsBytes(claims));
        mvc.perform(get("/members/me").header("Authorization", "Bearer " + String.join(".", parts)))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_3"));
    }

    @Test
    void updateChecksNicknameAndPersistsOnlyTheAuthenticatedMember() throws Exception {
        Member owner = member("profileOwner");
        Member other = member("profileOther");
        mvc.perform(patch("/members/me").header("Authorization", bearer(owner)).contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("nickname", owner.getNickname())))).andExpect(status().isOk());
        mvc.perform(patch("/members/me").header("Authorization", bearer(owner)).contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("nickname", other.getNickname()))))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("MEMBER409_1"));
        mvc.perform(patch("/members/me").header("Authorization", bearer(owner)).contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("nickname", "가")))).andExpect(status().isBadRequest());
        mvc.perform(patch("/members/me").header("Authorization", bearer(owner)).contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("nickname", "변경완료"))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.nickname").value("변경완료"));
        mvc.perform(get("/members/me").header("Authorization", bearer(owner)))
                .andExpect(jsonPath("$.result.nickname").value("변경완료"));
        assertThat(members.findById(other.getMemberId()).orElseThrow().getNickname()).isEqualTo("profileOther");
    }

    @Test
    void tokensOfRemovedMembersReturnDomain404() throws Exception {
        mvc.perform(get("/members/me").header("Authorization", "Bearer " + jwt.createAccessToken(99999999L, "gone@example.com")))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("MEMBER404_1"));
    }

    @Test
    void preflightAllowsAuthorizationWithoutTokenAndOldWriteRoutesAreGone() throws Exception {
        mvc.perform(options("/ratings").header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "POST")
                        .header("Access-Control-Request-Headers", "authorization,content-type"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
        Member owner = member("oldRoute");
        mvc.perform(post("/members/" + owner.getMemberId() + "/ratings").contentType(MediaType.APPLICATION_JSON)
                        .content(body(Map.of("movieId", 550, "score", 5)))).andExpect(status().isMethodNotAllowed());
        mvc.perform(post("/ratings").contentType(MediaType.APPLICATION_JSON).content(body(Map.of("movieId", 550, "score", 5))))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
    }
}
