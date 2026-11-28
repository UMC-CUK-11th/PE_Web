package com.umc.movie;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.service.RatingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class RatingServiceTests {
    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    @Test
    void duplicateRatingReturnsConflict() {
        long memberId = 1L;
        long movieId = 550L;
        when(memberRepository.findById(memberId)).thenReturn(Optional.of(mock(Member.class)));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(memberId, movieId)).thenReturn(true);

        assertThatThrownBy(() -> ratingService.create(memberId, new CreateRatingRequest(movieId, 5, null)))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(exception.getCode()).isEqualTo("RATING409_1");
                });
        verify(ratingRepository, never()).save(any());
    }

    @Test
    void updatingAnotherMembersRatingReturnsForbidden() {
        long ratingId = 10L;
        Member owner = mock(Member.class);
        when(owner.getMemberId()).thenReturn(1L);
        Rating rating = Rating.builder().member(owner).movieId(550L).score(5).comment("기존 후기").build();
        when(ratingRepository.findById(ratingId)).thenReturn(Optional.of(rating));

        assertThatThrownBy(() -> ratingService.update(2L, ratingId, new UpdateRatingRequest(2, "수정 후기")))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(exception.getCode()).isEqualTo("RATING403_1");
                });
        assertThat(rating.getScore()).isEqualTo(5);
        assertThat(rating.getComment()).isEqualTo("기존 후기");
        verify(ratingRepository, never()).save(any());
    }
}
