package com.umc11th.service;

import com.umc11th.repository.MemberRepository;
import com.umc11th.repository.RatingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.PageImpl;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    @Test
    void ratingsAreRequestedWithPagination() {
        when(memberRepository.existsById(1L)).thenReturn(true);
        when(ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(
                1L,
                PageRequest.of(0, 10)
        )).thenReturn(new PageImpl<>(List.of()));

        assertThat(ratingService.getRatingsByMember(1L, 0, 10)).isEmpty();
        verify(ratingRepository).findByMember_MemberIdOrderByRatingIdDesc(
                1L,
                PageRequest.of(0, 10)
        );
    }

    @Test
    void missingMemberReturnsNotFound() {
        when(memberRepository.existsById(999L)).thenReturn(false);

        assertThatThrownBy(() -> ratingService.getRatingsByMember(999L, 0, 10))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("404 NOT_FOUND");

        verifyNoInteractions(ratingRepository);
    }
}
