package com.umc.movie;

import com.umc.movie.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest        // 인증, 검증, 서비스, DB까지 실제로 올린다 (DB는 테스트용 메모리 DB)
@AutoConfigureMockMvc
@Transactional         // 테스트가 끝나면 저장한 데이터를 되돌린다
class RatingApiTest {

    private static final String BODY = "{\"movieId\":550,\"score\":5,\"comment\":\"다시 봐도 명작\"}";

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private JwtUtil jwtUtil;

    private String authorizationHeader;

    @BeforeEach
    void setUp() {
        // 로그인 API를 거치지 않으므로 비밀번호는 아무 값이나 괜찮다
        jdbc.update("INSERT INTO member (member_id, email, password, nickname) VALUES "
                + "(1, 'challenger@umc.com', '$2a$10$dummyEncodedPasswordValue', '영화조아')");
        authorizationHeader = "Bearer " + jwtUtil.createAccessToken(1L, "challenger@umc.com");
    }

    @Test
    @DisplayName("토큰 없이 평점을 등록하면 401과 AUTH401_2를 응답하고 평점을 저장하지 않는다")
    void createRatingWithoutToken() throws Exception {
        mockMvc.perform(post("/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("AUTH401_2"));

        assertEquals(0, jdbc.queryForObject("SELECT COUNT(*) FROM rating", Integer.class));
    }

    @Test
    @DisplayName("토큰을 담아 평점을 등록하면 201과 저장된 평점을 응답한다")
    void createRating() throws Exception {
        mockMvc.perform(post("/ratings")
                        .header(HttpHeaders.AUTHORIZATION, authorizationHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(BODY))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("COMMON201"))
                .andExpect(jsonPath("$.result.movieId").value(550))
                .andExpect(jsonPath("$.result.score").value(5));

        // 응답만 보지 않고 토큰의 주인 이름으로 실제로 저장됐는지도 본다
        assertEquals(1, jdbc.queryForObject(
                "SELECT COUNT(*) FROM rating WHERE member_id = 1 AND movie_id = 550", Integer.class));
    }
}
