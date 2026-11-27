package com.umc11th.service;

import com.umc11th.dto.CreateRatingRequest;
import com.umc11th.dto.RatingResponse;
import com.umc11th.dto.UpdateRatingRequest;
import com.umc11th.entity.Member;
import com.umc11th.entity.Rating;
import com.umc11th.exception.ApiException;
import com.umc11th.repository.MemberRepository;
import com.umc11th.repository.RatingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.PageImpl;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.never;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
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
                .isInstanceOfSatisfying(ApiException.class, exception ->
                        assertThat(exception.getCode()).isEqualTo("MEMBER404_1")
                );

        verifyNoInteractions(ratingRepository);
    }

    @Test
    void createsRatingForExistingMember() {
        Member member = member(1L);
        CreateRatingRequest request = new CreateRatingRequest(200L, 5, "좋아요");
        Rating savedRating = mock(Rating.class);
        when(savedRating.getRatingId()).thenReturn(3L);
        when(memberRepository.findById(1L)).thenReturn(java.util.Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 200L)).thenReturn(false);
        when(ratingRepository.save(org.mockito.ArgumentMatchers.any(Rating.class)))
                .thenReturn(savedRating);

        RatingResponse response = ratingService.create(1L, request);

        assertThat(response.ratingId()).isEqualTo(3L);
    }

    @Test
    @DisplayName("같은 영화에 평점을 중복 등록하면 RATING409_1을 응답하고 저장하지 않는다")
    void duplicateRatingIsRejected() {
        Member member = member(1L);
        when(memberRepository.findById(1L)).thenReturn(java.util.Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 101L)).thenReturn(true);

        assertThatThrownBy(() -> ratingService.create(
                1L,
                new CreateRatingRequest(101L, 5, null)
        )).isInstanceOfSatisfying(ApiException.class, exception ->
                assertThat(exception.getCode()).isEqualTo("RATING409_1")
        );

        verify(ratingRepository, never()).save(any(Rating.class));
    }

    @Test
    void ownerCanUpdateRating() {
        Rating rating = rating(1L, 1L);
        when(ratingRepository.findById(1L)).thenReturn(java.util.Optional.of(rating));

        ratingService.update(1L, 1L, new UpdateRatingRequest(3, "수정된 후기"));

        assertThat(rating.getScore()).isEqualTo(3);
        assertThat(rating.getComment()).isEqualTo("수정된 후기");
    }

    @Test
    @DisplayName("다른 회원의 평점을 수정하면 RATING403_1을 응답한다")
    void otherMemberCannotUpdateRating() {
        Rating rating = rating(1L, 1L);
        when(ratingRepository.findById(1L)).thenReturn(java.util.Optional.of(rating));

        assertThatThrownBy(() -> ratingService.update(
                2L,
                1L,
                new UpdateRatingRequest(3, null)
        )).isInstanceOfSatisfying(ApiException.class, exception ->
                assertThat(exception.getCode()).isEqualTo("RATING403_1")
        );
    }

    @Test
    void missingRatingCannotBeDeleted() {
        when(ratingRepository.findById(999L)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> ratingService.delete(1L, 999L))
                .isInstanceOfSatisfying(ApiException.class, exception ->
                        assertThat(exception.getCode()).isEqualTo("RATING404_1")
                );
    }

    private Member member(Long memberId) {
        Member member = Member.builder()
                .email("member" + memberId + "@umc.com")
                .password("bcrypt-hash")
                .nickname("회원" + memberId)
                .build();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        return member;
    }

    private Rating rating(Long ratingId, Long memberId) {
        Rating rating = Rating.builder()
                .member(member(memberId))
                .movieId(101L)
                .score(5)
                .comment("기존 후기")
                .build();
        ReflectionTestUtils.setField(rating, "ratingId", ratingId);
        return rating;
    }
}
