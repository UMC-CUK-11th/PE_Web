package com.umc.movie;

import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class DatabaseConflictApiTests {
    @Autowired MockMvc mvc;
    @MockitoSpyBean MemberRepository members;
    @Autowired RatingRepository ratings;

    @Test
    void databaseConflictAfterPassingPrechecksStillUsesCommonEnvelope() throws Exception {
        ratings.deleteAll();
        members.deleteAll();
        String body = "{\"email\":\"umc@example.com\",\"password\":\"Umc!1234\",\"nickname\":\"moviefan\"}";
        mvc.perform(post("/members").contentType("application/json").content(body))
                .andExpect(status().isCreated());
        // 사전 조회 결과가 오래된 동시 요청 상황만 재현합니다. save/DB/예외 처리는 실제로 실행됩니다.
        doReturn(false).when(members).existsByEmail("umc@example.com");
        doReturn(false).when(members).existsByNickname("moviefan");
        clearInvocations(members);
        mvc.perform(post("/members").contentType("application/json")
                        .content(body))
                .andExpect(status().isConflict()).andExpect(jsonPath("$.isSuccess").value(false))
                .andExpect(jsonPath("$.code").value("COMMON4091"))
                .andExpect(jsonPath("$.result").value(org.hamcrest.Matchers.nullValue()));
        verify(members).existsByEmail("umc@example.com");
        verify(members).existsByNickname("moviefan");
        verify(members).save(any());
        org.junit.jupiter.api.Assertions.assertEquals(1, members.count());
    }
}
