package com.umc11th.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.umc11th.dto.CreateMovieRecordRequest;
import com.umc11th.entity.Favorite;
import com.umc11th.entity.Member;
import com.umc11th.repository.FavoriteRepository;
import com.umc11th.repository.MemberRepository;
import com.umc11th.repository.RatingRepository;
import com.umc11th.util.JwtUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
class MovieRecordTransactionApiTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private RatingRepository ratingRepository;

    @MockitoSpyBean
    private FavoriteRepository favoriteRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    @DisplayName("즐겨찾기 저장이 실패하면 앞서 저장한 평점도 롤백된다")
    void movieRecordRollsBackRatingWhenFavoriteSaveFails() throws Exception {
        Member member = memberRepository.saveAndFlush(Member.builder()
                .email("transaction-api@umc.com")
                .password("bcrypt-hash")
                .nickname("트랜잭션테스트")
                .build());
        favoriteRepository.saveAndFlush(Favorite.builder()
                .member(member)
                .movieId(238L)
                .build());

        long ratingCountBefore = ratingRepository.count();

        // 사전 검사 직후 다른 요청이 같은 즐겨찾기를 저장한 동시성 상황을 재현합니다.
        doReturn(false).when(favoriteRepository)
                .existsByMember_MemberIdAndMovieId(member.getMemberId(), 238L);

        String authorizationHeader = "Bearer "
                + jwtUtil.createAccessToken(member.getMemberId(), member.getEmail());

        mockMvc.perform(post("/movie-records")
                        .header(HttpHeaders.AUTHORIZATION, authorizationHeader)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                new CreateMovieRecordRequest(238L, 5, "좋아요", true)
                        )))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("FAVORITE409_1"));

        assertThat(ratingRepository.count()).isEqualTo(ratingCountBefore);
    }
}
