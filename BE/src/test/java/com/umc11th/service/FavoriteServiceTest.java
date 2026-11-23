package com.umc11th.service;

import com.umc11th.dto.CreateFavoriteRequest;
import com.umc11th.dto.FavoriteResponse;
import com.umc11th.entity.Favorite;
import com.umc11th.entity.Member;
import com.umc11th.exception.ApiException;
import com.umc11th.repository.FavoriteRepository;
import com.umc11th.repository.MemberRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

    @Mock
    private FavoriteRepository favoriteRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private FavoriteService favoriteService;

    @Test
    void createsFavoriteForLoggedInMember() {
        Member member = member(1L);
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member));
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L))
                .thenReturn(false);
        when(favoriteRepository.save(any(Favorite.class))).thenAnswer(invocation -> {
            Favorite favorite = invocation.getArgument(0);
            ReflectionTestUtils.setField(favorite, "favoriteId", 10L);
            return favorite;
        });

        FavoriteResponse response = favoriteService.create(
                1L,
                new CreateFavoriteRequest(550L)
        );

        assertThat(response.favoriteId()).isEqualTo(10L);
        assertThat(response.movieId()).isEqualTo(550L);
    }

    @Test
    void duplicateFavoriteUsesFavorite4091() {
        when(memberRepository.findById(1L)).thenReturn(Optional.of(member(1L)));
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L))
                .thenReturn(true);

        assertThatThrownBy(() -> favoriteService.create(
                1L,
                new CreateFavoriteRequest(550L)
        )).isInstanceOfSatisfying(ApiException.class, exception ->
                assertThat(exception.getCode()).isEqualTo("FAVORITE409_1")
        );
    }

    @Test
    void favoritesAreReturnedNewestFirstFromRepository() {
        Favorite favorite = favorite(member(1L), 550L, 10L);
        when(favoriteRepository.findByMember_MemberIdOrderByFavoriteIdDesc(1L))
                .thenReturn(List.of(favorite));

        assertThat(favoriteService.getMyFavorites(1L))
                .extracting(FavoriteResponse::movieId)
                .containsExactly(550L);
    }

    @Test
    void statusIsFalseWhenFavoriteDoesNotExist() {
        when(favoriteRepository.existsByMember_MemberIdAndMovieId(1L, 550L))
                .thenReturn(false);

        assertThat(favoriteService.getStatus(1L, 550L).isFavorite()).isFalse();
    }

    @Test
    void missingFavoriteDeleteUsesFavorite4041() {
        when(favoriteRepository.findByMember_MemberIdAndMovieId(1L, 550L))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> favoriteService.delete(1L, 550L))
                .isInstanceOfSatisfying(ApiException.class, exception ->
                        assertThat(exception.getCode()).isEqualTo("FAVORITE404_1")
                );
    }

    @Test
    void deletesOwnedFavorite() {
        Favorite favorite = favorite(member(1L), 550L, 10L);
        when(favoriteRepository.findByMember_MemberIdAndMovieId(1L, 550L))
                .thenReturn(Optional.of(favorite));

        favoriteService.delete(1L, 550L);

        verify(favoriteRepository).delete(favorite);
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

    private Favorite favorite(Member member, Long movieId, Long favoriteId) {
        Favorite favorite = Favorite.builder()
                .member(member)
                .movieId(movieId)
                .build();
        ReflectionTestUtils.setField(favorite, "favoriteId", favoriteId);
        return favorite;
    }
}
