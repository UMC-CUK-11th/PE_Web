package com.umc.movie.service;

import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowable;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {
    @Mock FavoriteRepository favorites;
    @Mock MemberRepository members;
    @InjectMocks FavoriteService service;

    private final Member member = new Member("favorite@example.com", "unused", "favorite");

    @Test
    @DisplayName("즐겨찾기하지 않은 영화를 저장하고 영화 ID를 반환한다")
    void createsFavorite() {
        given(members.findById(1L)).willReturn(Optional.of(member));
        given(favorites.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(false);
        given(favorites.saveAndFlush(any(Favorite.class))).willAnswer(invocation -> invocation.getArgument(0));

        var response = service.create(1L, 550L);

        assertThat(response.movieId()).isEqualTo(550L);
        verify(favorites).saveAndFlush(any(Favorite.class));
    }

    @Test
    @DisplayName("같은 영화의 즐겨찾기를 다시 등록하면 409 FAVORITE409_1을 던지고 저장하지 않는다")
    void rejectsDuplicateFavorite() {
        given(members.findById(1L)).willReturn(Optional.of(member));
        given(favorites.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        Throwable failure = catchThrowable(() -> service.create(1L, 550L));

        verify(favorites, never()).saveAndFlush(any(Favorite.class));
        assertThat(failure).isInstanceOfSatisfying(ApiException.class, error -> {
            assertThat(error.getStatus()).isEqualTo(HttpStatus.CONFLICT);
            assertThat(error.getCode()).isEqualTo("FAVORITE409_1");
        });
    }
}
