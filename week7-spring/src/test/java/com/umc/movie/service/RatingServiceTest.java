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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    @Test
    @DisplayName("동일 회원이 같은 영화에 평점을 중복 등록하면 409와 RATING409_1 반환")
    void create_duplicateRating_throwsConflict() {
        // given
        Long memberId = 1L;
        Long movieId = 100L;
        CreateRatingRequest request =
                new CreateRatingRequest(movieId, 5, "좋은 영화");

        Member member = mock(Member.class);

        when(memberRepository.findById(memberId))
                .thenReturn(Optional.of(member));

        when(ratingRepository.existsByMember_MemberIdAndMovieId(
                memberId, movieId
        )).thenReturn(true);

        // when
        ApiException exception = assertThrows(
                ApiException.class,
                () -> ratingService.create(memberId, request)
        );

        // then
        assertEquals(HttpStatus.CONFLICT, exception.getStatus());
        assertEquals("RATING409_1", exception.getCode());

        verify(ratingRepository, never()).save(any(Rating.class));
    }

    @Test
    @DisplayName("다른 회원의 평점을 수정하면 403과 RATING403_1 반환")
    void update_otherMembersRating_throwsForbidden() {
        // given
        Long ratingId = 10L;
        Long ownerId = 1L;
        Long requesterId = 2L;

        UpdateRatingRequest request =
                new UpdateRatingRequest(4, "수정 시도");

        Member owner = mock(Member.class);
        when(owner.getMemberId()).thenReturn(ownerId);

        Rating rating = mock(Rating.class);
        when(rating.getMember()).thenReturn(owner);

        when(ratingRepository.findById(ratingId))
                .thenReturn(Optional.of(rating));

        // when
        ApiException exception = assertThrows(
                ApiException.class,
                () -> ratingService.update(
                        ratingId, requesterId, request
                )
        );

        // then
        assertEquals(HttpStatus.FORBIDDEN, exception.getStatus());
        assertEquals("RATING403_1", exception.getCode());

        verify(rating, never()).update(any(), any());
    }
}