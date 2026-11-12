package com.umc.movie;

import com.fasterxml.jackson.databind.*;
import com.umc.movie.repository.*;
import com.umc.movie.util.JwtUtil;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.*;

import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthApiIntegrationTests {
    @Autowired
    MockMvc mvc;
    @Autowired
    ObjectMapper json;
    @Autowired
    MemberRepository members;
    @Autowired
    RatingRepository ratings;
    @Autowired
    JwtUtil jwt;
    @Value("${jwt.secret}")
    String secret;

    @BeforeEach
    void clean() {
        ratings.deleteAll();
        members.deleteAll();
    }

    private String login(String email, String password) throws Exception {
        var r = mvc.perform(post("/auth/login").contentType("application/json").content(json.writeValueAsString(Map.of("email", email, "password", password))))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200")).andExpect(jsonPath("$.result.password").doesNotExist()).andReturn();
        return json.readTree(r.getResponse().getContentAsByteArray()).at("/result/accessToken").asText();
    }

    private void signup(String email, String nick) throws Exception {
        mvc.perform(post("/members").contentType("application/json").content(json.writeValueAsString(Map.of("email", email, "password", "Umc!1234", "nickname", nick))))
                .andExpect(status().isCreated());
    }

    @Test
    void nineStepScenarioAndPersistence() throws Exception {
        signup("a@umc.com", "memberA");
        signup("b@umc.com", "memberB");
        String a = login("a@umc.com", "Umc!1234"), b = login("b@umc.com", "Umc!1234");
        var created = mvc.perform(post("/ratings").header("Authorization", "Bearer " + a).contentType("application/json").content("{\"movieId\":550,\"score\":5}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result.ratingId").isNumber()).andReturn();
        long id = json.readTree(created.getResponse().getContentAsByteArray()).at("/result/ratingId").asLong();
        mvc.perform(post("/ratings").header("Authorization", "Bearer " + a).contentType("application/json").content("{\"movieId\":550,\"score\":5}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
        mvc.perform(patch("/ratings/" + id).header("Authorization", "Bearer " + a).contentType("application/json").content("{\"score\":4}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.score").value(4));
        mvc.perform(patch("/ratings/" + id).header("Authorization", "Bearer " + b).contentType("application/json").content("{\"score\":1}"))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("RATING403_1"));
        mvc.perform(delete("/ratings/" + id).header("Authorization", "Bearer " + b)).andExpect(status().isForbidden());
        assertEquals(4, ratings.findById(id).orElseThrow().getScore());
        mvc.perform(get("/members/me")).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        mvc.perform(delete("/ratings/999999").header("Authorization", "Bearer " + a)).andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("RATING404_1"));
        mvc.perform(delete("/ratings/" + id).header("Authorization", "Bearer " + a)).andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200")).andExpect(jsonPath("$.result").value(org.hamcrest.Matchers.nullValue()));
        assertEquals(0, ratings.count());
    }

    @Test
    void wrongPasswordAndUnknownEmailAreIdentical() throws Exception {
        signup("a@umc.com", "memberA");
        var a = mvc.perform(post("/auth/login").contentType("application/json").content("{\"email\":\"a@umc.com\",\"password\":\"wrong\"}")).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_1")).andReturn();
        var b = mvc.perform(post("/auth/login").contentType("application/json").content("{\"email\":\"unknown@umc.com\",\"password\":\"wrong\"}")).andExpect(status().isUnauthorized()).andReturn();
        assertEquals(a.getResponse().getContentAsString(), b.getResponse().getContentAsString());
    }

    @Test
    void myInfoValidationNicknameAndNoPasswordLeak() throws Exception {
        signup("a@umc.com", "memberA");
        signup("b@umc.com", "memberB");
        String a = login("a@umc.com", "Umc!1234");
        mvc.perform(get("/members/me").header("Authorization", "Bearer " + a)).andExpect(status().isOk()).andExpect(jsonPath("$.result.email").value("a@umc.com")).andExpect(jsonPath("$.result.password").doesNotExist()).andExpect(jsonPath("$.result.createdAt").isNotEmpty());
        for (String nick : List.of("memberA", "newName"))
            mvc.perform(patch("/members/me").header("Authorization", "Bearer " + a).contentType("application/json").content("{\"nickname\":\"" + nick + "\"}")).andExpect(status().isOk()).andExpect(jsonPath("$.result.nickname").value(nick));
        mvc.perform(patch("/members/me").header("Authorization", "Bearer " + a).contentType("application/json").content("{\"nickname\":\"memberB\"}")).andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("MEMBER409_1"));
        mvc.perform(patch("/members/me").header("Authorization", "Bearer " + a).contentType("application/json").content("{\"nickname\":\" \"}")).andExpect(status().isBadRequest());
        assertEquals("newName", members.findByEmail("a@umc.com").orElseThrow().getNickname());
        mvc.perform(get("/members/me").header("Authorization", "Bearer " + jwt.createAccessToken(999999L, "gone@umc.com"))).andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("MEMBER404_1"));
    }

    @Test
    void forgedExpiredAndInvalidClaimsAreUnauthorized() throws Exception {
        signup("a@umc.com", "memberA");
        String a = login("a@umc.com", "Umc!1234");
        String[] parts = a.split("\\.");
        char first = parts[1].charAt(0);
        String forged = parts[0] + "." + (first == 'A' ? 'B' : 'A') + parts[1].substring(1) + "." + parts[2];
        var key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        String expired = Jwts.builder().subject("1").expiration(Date.from(Instant.now().minusSeconds(120))).signWith(key).compact();
        String noSubject = Jwts.builder().expiration(Date.from(Instant.now().plusSeconds(3600))).signWith(key).compact();
        String badSubject = Jwts.builder().subject("not-a-number").expiration(Date.from(Instant.now().plusSeconds(3600))).signWith(key).compact();
        String noExpiry = Jwts.builder().subject("1").signWith(key).compact();
        for (String token : List.of(forged, "garbage", "", noSubject, badSubject, noExpiry))
            mvc.perform(get("/members/me").header("Authorization", "Bearer " + token)).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_3"));
        mvc.perform(get("/members/me").header("Authorization", "Bearer " + expired)).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_4"));
    }

    @Test
    void legacyWritesAreRemovedAndCorsAllowsAuthorization() throws Exception {
        signup("a@umc.com", "memberA");
        String a = login("a@umc.com", "Umc!1234");
        mvc.perform(post("/members/1/ratings").contentType("application/json").content("{\"movieId\":550,\"score\":5}")).andExpect(status().isMethodNotAllowed());
        mvc.perform(post("/members/1/ratings").header("Authorization", "Bearer " + a).contentType("application/json").content("{\"movieId\":550,\"score\":5}")).andExpect(status().isMethodNotAllowed());
        mvc.perform(options("/ratings").header("Origin", "http://localhost:5173").header("Access-Control-Request-Method", "POST").header("Access-Control-Request-Headers", "authorization,content-type")).andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
        assertEquals(0, ratings.count());
    }
}