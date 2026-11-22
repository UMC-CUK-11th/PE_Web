package com.umc.movie.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc.movie.config.JwtProvider;
import com.umc.movie.entity.Member;
import com.umc.movie.repository.MemberRepository;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

// 실제 요청 흐름(AuthInterceptor → Controller → Service → MySQL 테스트 DB)을 확인하는 통합 테스트.
// 기존 테스트와 같이 .env.local의 MySQL 테스트 DB를 쓰고, @Transactional로 테스트가 끝나면 롤백합니다.
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class RatingApiTest {

  @Autowired MockMvc mvc;
  @Autowired ObjectMapper json;
  @Autowired MemberRepository memberRepository;
  @Autowired JwtProvider jwtProvider;

  private Member saveMember() {
    String name = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    return memberRepository.save(new Member(name + "@example.com", "encoded-password", name));
  }

  @Test
  @DisplayName("토큰 없이 POST /ratings를 부르면 401과 AUTH401_2를 응답한다")
  void createWithoutToken() throws Exception {
    // given: Authorization 헤더가 없는 평점 등록 요청
    var body = Map.of("movieId", 550, "score", 5, "comment", "토큰 없이 등록");

    // when & then: 인터셉터가 막아 401 AUTH401_2를 응답한다
    mvc.perform(post("/ratings")
            .contentType(MediaType.APPLICATION_JSON)
            .content(json.writeValueAsBytes(body)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.isSuccess").value(false))
        .andExpect(jsonPath("$.code").value("AUTH401_2"))
        .andExpect(jsonPath("$.message").value("인증 토큰이 필요합니다."));
  }

  @Test
  @DisplayName("토큰을 담아 POST /ratings를 부르면 201과 COMMON201, 저장된 movieId를 응답한다")
  void createWithToken() throws Exception {
    // given: 가입된 회원과 그 회원의 토큰
    Member member = saveMember();
    String token = jwtProvider.create(member.getMemberId());
    var body = Map.of("movieId", 550, "score", 5, "comment", "인생 영화예요!");

    // when & then: 201 COMMON201과 저장된 평점의 movieId를 응답한다
    mvc.perform(post("/ratings")
            .header("Authorization", "Bearer " + token)
            .contentType(MediaType.APPLICATION_JSON)
            .content(json.writeValueAsBytes(body)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.isSuccess").value(true))
        .andExpect(jsonPath("$.code").value("COMMON201"))
        .andExpect(jsonPath("$.result.movieId").value(550))
        .andExpect(jsonPath("$.result.score").value(5));
  }
}
