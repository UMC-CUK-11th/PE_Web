package com.umc.movie.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

// DB 없이 Repository를 가짜(Mock)로 바꿔 FavoriteService의 규칙만 확인하는 단위 테스트
@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {

  @Mock FavoriteRepository favoriteRepository;
  @Mock MemberRepository memberRepository;
  @InjectMocks FavoriteService favoriteService;

  @Test
  @DisplayName("이미 즐겨찾기한 영화를 다시 등록하면 FAVORITE409_1 예외를 던지고 저장하지 않는다")
  void createDuplicateFavorite() {
    // given: 1번 회원이 550번 영화를 이미 즐겨찾기한 상태
    Long memberId = 1L;
    Long movieId = 550L;
    given(memberRepository.findById(memberId))
        .willReturn(Optional.of(new Member("fan@example.com", "encoded-password", "fan")));
    given(favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, movieId)).willReturn(true);

    // when & then: 409 FAVORITE409_1 예외가 나고
    assertThatThrownBy(() -> favoriteService.create(memberId, new CreateFavoriteRequest(movieId)))
        .isInstanceOf(ApiException.class)
        .satisfies(e -> {
          ApiException ex = (ApiException) e;
          assertThat(ex.getStatus()).isEqualTo(409);
          assertThat(ex.getCode()).isEqualTo("FAVORITE409_1");
        });
    // then: 저장은 호출되지 않는다
    verify(favoriteRepository, never()).save(any(Favorite.class));
  }

  @Test
  @DisplayName("즐겨찾기하지 않은 영화를 해제하면 FAVORITE404_1 예외를 던지고 삭제하지 않는다")
  void deleteNotFavorited() {
    // given: 1번 회원의 즐겨찾기에 550번 영화가 없는 상태
    Long memberId = 1L;
    Long movieId = 550L;
    given(favoriteRepository.findByMember_MemberIdAndMovieId(memberId, movieId))
        .willReturn(Optional.empty());

    // when & then: 404 FAVORITE404_1 예외가 나고
    assertThatThrownBy(() -> favoriteService.delete(memberId, movieId))
        .isInstanceOf(ApiException.class)
        .satisfies(e -> {
          ApiException ex = (ApiException) e;
          assertThat(ex.getStatus()).isEqualTo(404);
          assertThat(ex.getCode()).isEqualTo("FAVORITE404_1");
        });
    // then: 삭제는 호출되지 않는다
    verify(favoriteRepository, never()).delete(any(Favorite.class));
  }
}
