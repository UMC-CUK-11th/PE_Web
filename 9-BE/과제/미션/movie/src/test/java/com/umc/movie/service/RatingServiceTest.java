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
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    // 빌더로는 ID를 넣을 수 없어서, DB가 채워 주는 ID를 테스트에서 직접 넣는다
    private Member member(long memberId, String nickname) {
        Member member = Member.builder()
                .email(nickname + "@umc.com")
                .password("암호화된비밀번호")
                .nickname(nickname)
                .build();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        return member;
    }

    @Test
    @DisplayName("같은 영화에 평점을 다시 등록하면 RATING409_1 예외를 던지고 저장하지 않는다")
    void createRatingWhenDuplicated() {
        // given: 1번 회원이 550번 영화에 이미 평점을 남겼다
        given(memberRepository.findById(1L)).willReturn(Optional.of(member(1L, "영화조아")));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        // when & then: 409 예외가 나고 저장은 시도하지 않는다
        assertThatThrownBy(() -> ratingService.create(1L, new CreateRatingRequest(550L, 5, "또 남기기")))
                .isInstanceOf(ApiException.class)
                .hasMessage("이미 이 영화에 평점을 남기셨습니다.")
                .satisfies(e -> {
                    ApiException exception = (ApiException) e;
                    assertThat(exception.getCode()).isEqualTo("RATING409_1");
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                });

        verify(ratingRepository, never()).saveAndFlush(any(Rating.class));
    }

    @Test
    @DisplayName("남의 평점을 수정하려 하면 RATING403_1 예외를 던지고 내용을 바꾸지 않는다")
    void updateOthersRating() {
        // given: 10번 평점은 2번 회원이 쓴 것이다
        Rating othersRating = Rating.builder()
                .member(member(2L, "민서"))
                .movieId(550L)
                .score(3)
                .comment("원래 후기")
                .build();
        given(ratingRepository.findById(10L)).willReturn(Optional.of(othersRating));

        // when & then: 1번 회원이 고치려 하면 403 예외가 난다
        assertThatThrownBy(() -> ratingService.update(1L, 10L, new UpdateRatingRequest(5, "남의 후기 고치기")))
                .isInstanceOf(ApiException.class)
                .hasMessage("본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.")
                .satisfies(e -> {
                    ApiException exception = (ApiException) e;
                    assertThat(exception.getCode()).isEqualTo("RATING403_1");
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                });

        // 예외가 났다에서 멈추지 않고, 남의 평점 내용이 그대로인지와 저장하지 않았는지까지 본다
        assertThat(othersRating.getScore()).isEqualTo(3);
        assertThat(othersRating.getComment()).isEqualTo("원래 후기");
        verify(ratingRepository, never()).saveAndFlush(any(Rating.class));
    }
}
