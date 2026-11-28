package com.umc.movie.controller;

import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RatingIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private Member member;

    @BeforeEach
    void setUp() {
        ratingRepository.deleteAll();
        memberRepository.deleteAll();

        member = memberRepository.save(
                Member.builder()
                        .email("rating-test@example.com")
                        .password("test-password")
                        .nickname("ratingTester")
                        .build()
        );
    }

    @Test
    @DisplayName("JWT 없이 평점 등록 요청 시 HTTP 401과 AUTH401_2 반환")
    void createRating_withoutJwt_returns401() throws Exception {
        mockMvc.perform(post("/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "movieId": 100,
                                  "score": 5,
                                  "comment": "테스트 평점"
                                }
                                """))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH401_2"));
    }

    @Test
    @DisplayName("정상 JWT로 평점 등록 시 HTTP 201과 COMMON201 반환 및 DB 저장")
    void createRating_withJwt_returns201() throws Exception {
        String token = jwtUtil.createAccessToken(
                member.getMemberId(),
                member.getEmail()
        );

        mockMvc.perform(post("/ratings")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "movieId": 100,
                                  "score": 5,
                                  "comment": "테스트 평점"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.result").isNumber());

        assertTrue(
                ratingRepository.existsByMember_MemberIdAndMovieId(
                        member.getMemberId(), 100L
                )
        );
    }
}