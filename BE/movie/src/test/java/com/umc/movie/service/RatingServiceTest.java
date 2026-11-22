package com.umc.movie.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import java.util.Optional;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

// DB 없이 Repository를 가짜(Mock)로 바꿔 RatingService의 규칙만 확인하는 단위 테스트
@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

  @Mock MemberRepository memberRepository;
  @Mock RatingRepository ratingRepository;
  @InjectMocks RatingService ratingService;

  // Member는 생성자로 만들고, DB가 채워 주는 memberId만 테스트용으로 넣어 줍니다.
  private Member member(Long memberId, String name) {
    Member member = new Member(name + "@example.com", "encoded-password", name);
    ReflectionTestUtils.setField(member, "memberId", memberId);
    return member;
  }

  @Test
  @DisplayName("같은 영화에 평점을 중복 등록하면 RATING409_1 예외를 던지고 저장하지 않는다")
  void createDuplicateRating() {
    // given: 1번 회원이 550번 영화에 이미 평점을 남긴 상태
    Long memberId = 1L;
    Long movieId = 550L;
    given(memberRepository.findById(memberId)).willReturn(Optional.of(member(memberId, "writer")));
    given(ratingRepository.existsByMember_MemberIdAndMovieId(memberId, movieId)).willReturn(true);
    CreateRatingRequest request = new CreateRatingRequest(movieId, 5, "또 남기는 평점");

    // when & then: 다시 등록하면 409 RATING409_1 예외가 나고
    assertThatThrownBy(() -> ratingService.create(memberId, request))
        .isInstanceOf(ApiException.class)
        .satisfies(e -> {
          ApiException ex = (ApiException) e;
          assertThat(ex.getStatus()).isEqualTo(409);
          assertThat(ex.getCode()).isEqualTo("RATING409_1");
        });
    // then: 저장은 한 번도 호출되지 않는다
    verify(ratingRepository, never()).saveAndFlush(any(Rating.class));
    verify(ratingRepository, never()).save(any(Rating.class));
  }

  @Test
  @DisplayName("남의 평점을 수정하려 하면 RATING403_1 예외를 던지고 수정하지 않는다")
  void updateOthersRating() {
    // given: 10번 평점은 1번 회원(작성자)의 것이고, 2번 회원이 수정하려는 상황
    Long ratingId = 10L;
    Long otherMemberId = 2L;
    Rating rating = new Rating(member(1L, "writer"), 550L, 5, "원래 한줄평");
    given(memberRepository.existsById(otherMemberId)).willReturn(true);
    given(ratingRepository.findById(ratingId)).willReturn(Optional.of(rating));
    UpdateRatingRequest request = new UpdateRatingRequest(1, "남이 바꾼 한줄평");

    // when & then: 403 RATING403_1 예외가 나고
    assertThatThrownBy(() -> ratingService.update(ratingId, otherMemberId, request))
        .isInstanceOf(ApiException.class)
        .satisfies(e -> {
          ApiException ex = (ApiException) e;
          assertThat(ex.getStatus()).isEqualTo(403);
          assertThat(ex.getCode()).isEqualTo("RATING403_1");
        });
    // then: 평점 내용은 그대로 남아 있다
    assertThat(rating.getScore()).isEqualTo(5);
    assertThat(rating.getComment()).isEqualTo("원래 한줄평");
  }
}
