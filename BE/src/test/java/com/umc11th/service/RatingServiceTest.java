package com.umc11th.service;

import com.umc11th.dto.CreateRatingRequest;
import com.umc11th.dto.UpdateRatingRequest;
import com.umc11th.entity.Member;
import com.umc11th.entity.Rating;
import com.umc11th.exception.BusinessException;
import com.umc11th.exception.ErrorCode;
import com.umc11th.repository.MemberRepository;
import com.umc11th.repository.RatingRepository;
import org.junit.jupiter.api.Test;
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
                .isInstanceOfSatisfying(BusinessException.class, exception ->
                        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.MEMBER_NOT_FOUND)
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

        assertThat(ratingService.create(1L, request)).isEqualTo(3L);
    }

    @Test
    void duplicateRatingIsRejected() {
        Member member = member(1L);
        when(memberRepository.findById(1L)).thenReturn(java.util.Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 101L)).thenReturn(true);

        assertThatThrownBy(() -> ratingService.create(
                1L,
                new CreateRatingRequest(101L, 5, null)
        )).isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.RATING_DUPLICATE)
        );
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
    void otherMemberCannotUpdateRating() {
        Rating rating = rating(1L, 1L);
        when(ratingRepository.findById(1L)).thenReturn(java.util.Optional.of(rating));

        assertThatThrownBy(() -> ratingService.update(
                1L,
                2L,
                new UpdateRatingRequest(3, null)
        )).isInstanceOfSatisfying(BusinessException.class, exception ->
                assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.RATING_FORBIDDEN)
        );
    }

    @Test
    void missingRatingCannotBeDeleted() {
        when(ratingRepository.findById(999L)).thenReturn(java.util.Optional.empty());

        assertThatThrownBy(() -> ratingService.delete(999L, 1L))
                .isInstanceOfSatisfying(BusinessException.class, exception ->
                        assertThat(exception.getErrorCode()).isEqualTo(ErrorCode.RATING_NOT_FOUND)
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
