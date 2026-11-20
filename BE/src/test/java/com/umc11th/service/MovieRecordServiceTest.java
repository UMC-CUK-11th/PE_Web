package com.umc11th.service;

import com.umc11th.dto.CreateMovieRecordRequest;
import com.umc11th.dto.MovieRecordResponse;
import com.umc11th.entity.Favorite;
import com.umc11th.entity.Member;
import com.umc11th.entity.Rating;
import com.umc11th.exception.ApiException;
import com.umc11th.repository.FavoriteRepository;
import com.umc11th.repository.MemberRepository;
import com.umc11th.repository.RatingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Method;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MovieRecordServiceTest {

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private FavoriteRepository favoriteRepository;

    @InjectMocks
    private MovieRecordService movieRecordService;

    @Test
    void createMethodIsTransactional() throws NoSuchMethodException {
        Method method = MovieRecordService.class.getMethod(
                "create",
                Long.class,
                CreateMovieRecordRequest.class
        );

        assertThat(method.isAnnotationPresent(Transactional.class)).isTrue();
    }

    @Test
    void savesRatingAndFavoriteTogether() {
        Member member = member(1L);
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 238L))
                .thenReturn(false);
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 238L))
                .thenReturn(false);
        when(ratingRepository.save(any(Rating.class))).thenAnswer(invocation -> {
            Rating rating = invocation.getArgument(0);
            ReflectionTestUtils.setField(rating, "ratingId", 20L);
            return rating;
        });
        when(favoriteRepository.save(any(Favorite.class))).thenAnswer(invocation -> {
            Favorite favorite = invocation.getArgument(0);
            ReflectionTestUtils.setField(favorite, "favoriteId", 30L);
            return favorite;
        });

        MovieRecordResponse response = movieRecordService.create(
                1L,
                new CreateMovieRecordRequest(238L, 5, "좋아요", true)
        );

        assertThat(response.rating().ratingId()).isEqualTo(20L);
        assertThat(response.favorite().favoriteId()).isEqualTo(30L);
        verify(ratingRepository).save(any(Rating.class));
        verify(favoriteRepository).save(any(Favorite.class));
    }

    @Test
    void doesNotSaveFavoriteWhenOptionIsFalse() {
        Member member = member(1L);
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 239L))
                .thenReturn(false);
        when(ratingRepository.save(any(Rating.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MovieRecordResponse response = movieRecordService.create(
                1L,
                new CreateMovieRecordRequest(239L, 4, null, false)
        );

        assertThat(response.favorite()).isNull();
        verify(favoriteRepository, never()).save(any(Favorite.class));
    }

    @Test
    void duplicateRatingStopsBeforeSaving() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member(1L)));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 238L))
                .thenReturn(true);

        assertThatThrownBy(() -> movieRecordService.create(
                1L,
                new CreateMovieRecordRequest(238L, 5, null, true)
        )).isInstanceOfSatisfying(ApiException.class, exception ->
                assertThat(exception.getCode()).isEqualTo("RATING409_1")
        );

        verify(ratingRepository, never()).save(any(Rating.class));
        verify(favoriteRepository, never()).save(any(Favorite.class));
    }

    @Test
    void duplicateFavoriteStopsBeforeSavingRating() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member(1L)));
        when(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 238L))
                .thenReturn(false);
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 238L))
                .thenReturn(true);

        assertThatThrownBy(() -> movieRecordService.create(
                1L,
                new CreateMovieRecordRequest(238L, 5, null, true)
        )).isInstanceOfSatisfying(ApiException.class, exception ->
                assertThat(exception.getCode()).isEqualTo("FAVORITE409_1")
        );

        verify(ratingRepository, never()).save(any(Rating.class));
        verify(favoriteRepository, never()).save(any(Favorite.class));
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
}
