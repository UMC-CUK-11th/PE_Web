package com.umc.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.service.MemberService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AuthIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;
    @Autowired MemberService members;

    private String login(String email, String password) throws Exception {
        String body = mapper.writeValueAsString(java.util.Map.of("email", email, "password", password));
        String response = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200"))
                .andReturn().getResponse().getContentAsString(StandardCharsets.UTF_8);
        return mapper.readTree(response).path("result").path("accessToken").asText();
    }

    @Test void mandatoryNineStepScenario() throws Exception {
        for (String name : new String[]{"a", "b"}) {
            mvc.perform(post("/members").contentType(MediaType.APPLICATION_JSON)
                    .content("{\"email\":\"" + name + "@umc.com\",\"password\":\"Umc1234!\",\"nickname\":\"회원" + name + "\"}"))
                    .andExpect(status().isCreated());
        }
        String tokenA = login("a@umc.com", "Umc1234!");
        String tokenB = login("b@umc.com", "Umc1234!");
        String rating = "{\"movieId\":155,\"score\":5,\"comment\":\"좋아요\"}";
        String created = mvc.perform(post("/ratings").header("Authorization", "Bearer " + tokenA)
                .contentType(MediaType.APPLICATION_JSON).content(rating))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.code").value("COMMON201"))
                .andReturn().getResponse().getContentAsString();
        long ratingId = mapper.readTree(created).path("result").path("ratingId").asLong();
        mvc.perform(post("/ratings").header("Authorization", "Bearer " + tokenA)
                .contentType(MediaType.APPLICATION_JSON).content(rating))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("RATING409_1"));
        String update = "{\"score\":4,\"comment\":\"수정\"}";
        mvc.perform(patch("/ratings/{id}", ratingId).header("Authorization", "Bearer " + tokenA)
                .contentType(MediaType.APPLICATION_JSON).content(update))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.score").value(4));
        mvc.perform(patch("/ratings/{id}", ratingId).header("Authorization", "Bearer " + tokenB)
                .contentType(MediaType.APPLICATION_JSON).content(update))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("RATING403_1"));
        mvc.perform(patch("/ratings/{id}", ratingId).contentType(MediaType.APPLICATION_JSON).content(update))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_2"));
        mvc.perform(delete("/ratings/99999").header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("RATING404_1"));
        mvc.perform(delete("/ratings/{id}", ratingId).header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("RATING403_1"));
        mvc.perform(delete("/ratings/{id}", ratingId).header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isOk()).andExpect(jsonPath("$.code").value("COMMON200"))
                .andExpect(jsonPath("$.result").isEmpty());
    }

    @Test void sameLoginFailureAndMissingToken() throws Exception {
        members.signUp(new SignUpRequest("auth@umc.com", "Umc1234!", "인증회원"));
        String first = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"auth@umc.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_1"))
                .andReturn().getResponse().getContentAsString();
        String second = mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"absent@umc.com\",\"password\":\"wrong\"}"))
                .andExpect(status().isUnauthorized()).andReturn().getResponse().getContentAsString();
        assertThat(mapper.readTree(first)).isEqualTo(mapper.readTree(second));
        mvc.perform(get("/members/me")).andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test void profileAndTamperedToken() throws Exception {
        var member = members.signUp(new SignUpRequest("profile@umc.com", "Umc1234!", "프로필"));
        String token = login("profile@umc.com", "Umc1234!");
        mvc.perform(get("/members/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.email").value("profile@umc.com"))
                .andExpect(jsonPath("$.result.password").doesNotExist());
        mvc.perform(patch("/members/me").header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON).content("{\"nickname\":\"변경닉네임\"}"))
                .andExpect(status().isOk()).andExpect(jsonPath("$.result.nickname").value("변경닉네임"));
        mvc.perform(patch("/members/me").header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON).content("{\"nickname\":\"수현\"}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("MEMBER409_1"));
        mvc.perform(patch("/members/me").header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON).content("{\"nickname\":\"\"}"))
                .andExpect(status().isBadRequest());
        String[] parts = token.split("\\.");
        JsonNode payload = mapper.readTree(Base64.getUrlDecoder().decode(parts[1]));
        assertThat(payload.path("sub").asText()).isEqualTo(member.memberId().toString());
        assertThat(payload.has("password")).isFalse();
        String changed = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8)
                .replace("profile@umc.com", "changed@umc.com");
        String forged = parts[0] + "." + Base64.getUrlEncoder().withoutPadding()
                .encodeToString(changed.getBytes(StandardCharsets.UTF_8)) + "." + parts[2];
        mvc.perform(get("/members/me").header("Authorization", "Bearer " + forged))
                .andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("AUTH401_3"));
        mvc.perform(options("/ratings").header("Origin", "http://localhost:5173")
                .header("Access-Control-Request-Method", "POST")
                .header("Access-Control-Request-Headers", "authorization,content-type"))
                .andExpect(status().isOk()).andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }
}
