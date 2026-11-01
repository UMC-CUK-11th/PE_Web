package com.umc.movie;

import com.umc.movie.config.PasswordConfig;
import com.umc.movie.controller.*;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.repository.*;
import com.umc.movie.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

// 실제 Controller/Service/DTO를 사용하고 DB 접근만 대체합니다.
class StandardMissionTests {
    private MemberRepository members;
    private RatingRepository ratings;
    private PasswordEncoder encoder;
    private MockMvc mvc;
    private Member owner;
    private Rating rating;

    @BeforeEach
    void setUp() {
        members = mock(MemberRepository.class);
        ratings = mock(RatingRepository.class);
        encoder = new PasswordConfig().passwordEncoder();
        mvc = MockMvcBuilders.standaloneSetup(
                new MemberController(new MemberService(members, encoder)),
                new RatingController(new RatingService(ratings, members)))
                .setControllerAdvice(new GlobalExceptionHandler()).build();
        owner = Member.builder().email("owner@example.com").password("unused").nickname("owner").build();
        ReflectionTestUtils.setField(owner, "memberId", 1L);
        rating = Rating.builder().member(owner).movieId(100L).score(5).comment("before").build();
        ReflectionTestUtils.setField(rating, "ratingId", 10L);
        when(members.findById(1L)).thenReturn(Optional.of(owner));
        when(ratings.findById(10L)).thenReturn(Optional.of(rating));
    }

    private String signup(String email, String password, String nickname) {
        return "{\"email\":\"" + email + "\",\"password\":\"" + password
                + "\",\"nickname\":\"" + nickname + "\"}";
    }

    @Test
    void signupReturns201WithoutPasswordAndStoresBcrypt() throws Exception {
        when(members.save(any(Member.class))).thenAnswer(invocation -> {
            Member saved = invocation.getArgument(0);
            ReflectionTestUtils.setField(saved, "memberId", 2L);
            return saved;
        });
        mvc.perform(post("/members").contentType(APPLICATION_JSON)
                .content(signup("new@example.com", "Umc!1234", "newmember")))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result.memberId").value(2))
                .andExpect(jsonPath("$.result.password").doesNotExist());
        ArgumentCaptor<Member> saved = ArgumentCaptor.forClass(Member.class);
        verify(members).save(saved.capture());
        assertThat(saved.getValue().getPassword()).startsWith("$2").isNotEqualTo("Umc!1234");
        assertThat(encoder.matches("Umc!1234", saved.getValue().getPassword())).isTrue();
    }

    @ParameterizedTest
    @ValueSource(strings = {"email", "nickname"})
    void duplicateSignupDoesNotSave(String field) throws Exception {
        if (field.equals("email")) when(members.existsByEmail(anyString())).thenReturn(true);
        else when(members.existsByNickname(anyString())).thenReturn(true);
        mvc.perform(post("/members").contentType(APPLICATION_JSON)
                .content(signup("new@example.com", "Umc!1234", "newmember")))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4092"));
        verify(members, never()).save(any());
    }

    @ParameterizedTest
    @ValueSource(strings = {"email", "password", "nickname"})
    void invalidSignupReturns400(String field) throws Exception {
        mvc.perform(post("/members").contentType(APPLICATION_JSON)
                .content(signup(field.equals("email") ? "bad" : "new@example.com",
                        field.equals("password") ? "weak" : "Umc!1234",
                        field.equals("nickname") ? "a" : "newmember")))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON4001"));
        verify(members, never()).save(any());
    }

    @Test
    void createRatingReturns201WithId() throws Exception {
        when(ratings.save(any(Rating.class))).thenReturn(rating);
        mvc.perform(post("/members/1/ratings").contentType(APPLICATION_JSON)
                .content("{\"movieId\":100,\"score\":5,\"comment\":\"good\"}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.result").value(10));
    }

    @Test
    void duplicateRatingDoesNotSave() throws Exception {
        when(ratings.existsByMember_MemberIdAndMovieId(1L, 100L)).thenReturn(true);
        mvc.perform(post("/members/1/ratings").contentType(APPLICATION_JSON)
                .content("{\"movieId\":100,\"score\":5}"))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("COMMON4092"));
        verify(ratings, never()).save(any());
    }

    @ParameterizedTest
    @ValueSource(ints = {0, 6})
    void invalidScoreDoesNotSave(int score) throws Exception {
        mvc.perform(post("/members/1/ratings").contentType(APPLICATION_JSON)
                .content("{\"movieId\":100,\"score\":" + score + "}"))
                .andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("COMMON4001"));
        verify(ratings, never()).save(any());
    }

    @Test
    void patchUpdatesRating() throws Exception {
        mvc.perform(patch("/members/1/ratings/10").contentType(APPLICATION_JSON)
                .content("{\"score\":3,\"comment\":\"after\"}"))
                .andExpect(status().isOk());
        assertThat(rating.getScore()).isEqualTo(3);
        assertThat(rating.getComment()).isEqualTo("after");
        verify(ratings).save(rating);
    }

    @Test
    void deleteReturns204WithoutBody() throws Exception {
        mvc.perform(delete("/members/1/ratings/10"))
                .andExpect(status().isNoContent()).andExpect(content().string(""));
        verify(ratings).delete(rating);
    }

    @ParameterizedTest
    @ValueSource(strings = {"PATCH", "DELETE"})
    void otherMemberGets403WithoutChangingRating(String method) throws Exception {
        MockHttpServletRequestBuilder request = method.equals("PATCH")
                ? patch("/members/2/ratings/10").contentType(APPLICATION_JSON).content("{\"score\":3}")
                : delete("/members/2/ratings/10");
        mvc.perform(request).andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("COMMON403"));
        verify(ratings, never()).save(any());
        verify(ratings, never()).delete(any(Rating.class));
        assertThat(rating.getScore()).isEqualTo(5);
    }

    @ParameterizedTest
    @ValueSource(strings = {"PATCH", "DELETE"})
    void missingRatingGets404(String method) throws Exception {
        MockHttpServletRequestBuilder request = method.equals("PATCH")
                ? patch("/members/1/ratings/999").contentType(APPLICATION_JSON).content("{\"score\":3}")
                : delete("/members/1/ratings/999");
        mvc.perform(request).andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("COMMON404"));
        verify(ratings, never()).save(any());
        verify(ratings, never()).delete(any(Rating.class));
    }
}
