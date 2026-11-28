package com.umc.movie;

import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class RatingApiTests {
    private static final long MOVIE_ID = 550L;
    private static final String RATING_BODY = """
            {"movieId": 550, "score": 5, "comment": "좋았음."}
            """;

    @Autowired
    private MockMvc mvc;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void createWithoutTokenReturnsUnauthorized() throws Exception {
        long previousCount = ratingRepository.count();

        mvc.perform(post("/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(RATING_BODY))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"))
                .andExpect(jsonPath("$.result").value(nullValue()));

        assertThat(ratingRepository.count()).isEqualTo(previousCount);
    }

    @Test
    void createWithValidTokenReturnsCreated() throws Exception {
        Member member = memberRepository.save(Member.builder()
                .email("rating-test@example.com").password("test-hash").nickname("rating-tester").build());
        String token = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());

        mvc.perform(post("/ratings")
                        .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(RATING_BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.isSuccess").value(true))
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.ratingId").isNumber())
                .andExpect(jsonPath("$.result.movieId").value(MOVIE_ID))
                .andExpect(jsonPath("$.result.score").value(5));

        assertThat(ratingRepository.existsByMember_MemberIdAndMovieId(member.getMemberId(), MOVIE_ID)).isTrue();
    }
}
