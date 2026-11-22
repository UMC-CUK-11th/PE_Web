package com.umc.movie.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.transaction.annotation.Transactional;

// 즐겨찾기 API의 실제 요청 흐름을 확인하는 통합 테스트 (MySQL 테스트 DB + @Transactional 롤백)
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class FavoriteApiTest {

  @Autowired MockMvc mvc;
  @Autowired ObjectMapper json;
  @Autowired MemberRepository memberRepository;
  @Autowired JwtProvider jwtProvider;

  private String tokenOfNewMember() {
    String name = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    Member member = memberRepository.save(new Member(name + "@example.com", "encoded-password", name));
    return jwtProvider.create(member.getMemberId());
  }

  private MockHttpServletRequestBuilder favoriteRequest(Long movieId) throws Exception {
    return post("/favorites")
        .contentType(MediaType.APPLICATION_JSON)
        .content(json.writeValueAsBytes(Map.of("movieId", movieId)));
  }

  @Test
  @DisplayName("토큰 없이 POST /favorites를 부르면 401과 AUTH401_2를 응답한다")
  void createWithoutToken() throws Exception {
    // given: Authorization 헤더 없는 요청
    // when & then
    mvc.perform(favoriteRequest(550L))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value("AUTH401_2"));
  }

  @Test
  @DisplayName("토큰을 담아 POST /favorites를 부르면 201과 COMMON201, 저장된 movieId를 응답한다")
  void createWithToken() throws Exception {
    // given
    String token = tokenOfNewMember();
    // when & then
    mvc.perform(favoriteRequest(550L).header("Authorization", "Bearer " + token))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.code").value("COMMON201"))
        .andExpect(jsonPath("$.result.movieId").value(550));
  }

  @Test
  @DisplayName("같은 영화를 두 번 즐겨찾기하면 두 번째 요청은 409와 FAVORITE409_1을 응답한다")
  void createDuplicate() throws Exception {
    // given: 이미 550번 영화를 즐겨찾기한 회원
    String token = tokenOfNewMember();
    mvc.perform(favoriteRequest(550L).header("Authorization", "Bearer " + token))
        .andExpect(status().isCreated());
    // when & then: 같은 영화를 다시 등록
    mvc.perform(favoriteRequest(550L).header("Authorization", "Bearer " + token))
        .andExpect(status().isConflict())
        .andExpect(jsonPath("$.code").value("FAVORITE409_1"));
  }

  @Test
  @DisplayName("즐겨찾기하지 않은 영화를 GET /favorites/{movieId}로 조회하면 isFavorite false를 응답한다")
  void statusFalse() throws Exception {
    // given: 즐겨찾기가 하나도 없는 회원
    String token = tokenOfNewMember();
    // when & then
    mvc.perform(get("/favorites/{movieId}", 550L).header("Authorization", "Bearer " + token))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.code").value("COMMON200"))
        .andExpect(jsonPath("$.result.isFavorite").value(false));
  }

  @Test
  @DisplayName("Swagger 문서 JSON(/v3/api-docs)은 토큰 없이도 200으로 열린다")
  void apiDocsIsPublic() throws Exception {
    // given: 토큰 없는 요청
    // when & then
    mvc.perform(get("/v3/api-docs"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.components.securitySchemes.bearerAuth.scheme").value("bearer"));
  }
}
