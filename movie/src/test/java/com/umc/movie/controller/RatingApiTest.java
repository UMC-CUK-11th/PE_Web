package com.umc.movie.controller;

import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RatingApiTest {

    private static final String RATING_BODY = """
            {"movieId":550,"score":5}
            """;

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private MemberRepository memberRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @Test
    @DisplayName("토큰 없이 평점 등록을 요청하면 401 AUTH401_2를 응답한다")
    void createRatingWithoutTokenReturns401() throws Exception {
        mockMvc.perform(post("/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(RATING_BODY))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    @DisplayName("유효한 토큰과 평점으로 등록을 요청하면 201 COMMON201과 등록 결과를 응답한다")
    void createRatingWithTokenReturns201() throws Exception {
        Member member = memberRepository.save(new Member("rating@example.com", "test-hash", "평점회원"));
        String token = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());

        mockMvc.perform(post("/ratings")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(RATING_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.ratingId").isNumber())
                .andExpect(jsonPath("$.result.movieId").value(550));
    }
}
