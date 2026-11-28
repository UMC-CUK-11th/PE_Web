package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {
    @Mock RatingRepository ratings;
    @Mock MemberRepository members;
    @InjectMocks RatingService service;

    @Test
    @DisplayName("같은 영화에 평점을 다시 등록하면 409 RATING409_1을 던지고 저장하지 않는다")
    void rejectsDuplicateRating() {
        var member = new Member("rating@example.com", "unused", "rater");
        given(members.findById(1L)).willReturn(Optional.of(member));
        given(ratings.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        assertThatExceptionOfType(ApiException.class)
                .isThrownBy(() -> service.create(1L, new CreateRatingRequest(550L, 5, null)))
                .satisfies(error -> {
                    assertThat(error.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(error.getCode()).isEqualTo("RATING409_1");
                });
        verify(ratings, never()).saveAndFlush(any(Rating.class));
    }

    @Test
    @DisplayName("다른 회원의 평점을 수정하면 403 RATING403_1을 던지고 평점을 유지한다")
    void rejectsUpdatingAnotherMembersRating() {
        var owner = mock(Member.class);
        given(owner.getMemberId()).willReturn(2L);
        var rating = new Rating(owner, 550L, 5, "원래 후기");
        given(ratings.findById(10L)).willReturn(Optional.of(rating));

        assertThatExceptionOfType(ApiException.class)
                .isThrownBy(() -> service.update(1L, 10L, new UpdateRatingRequest(1, "변경된 후기")))
                .satisfies(error -> {
                    assertThat(error.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(error.getCode()).isEqualTo("RATING403_1");
                });
        assertThat(rating.getScore()).isEqualTo(5);
        assertThat(rating.getComment()).isEqualTo("원래 후기");
        verify(ratings, never()).flush();
    }
}
