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

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.catchThrowableOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
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

    @Test
    @DisplayName(
            "같은 영화에 평점을 중복 등록하면 RATING409_1 예외를 던진다"
    )
    void createRatingWhenDuplicated() {

        Member member =
                Member.builder()
                        .email("challenger@umc.com")
                        .password("암호화된비밀번호")
                        .nickname("영화조아")
                        .build();

        given(
                memberRepository.findById(1L)
        ).willReturn(
                Optional.of(member)
        );

        given(
                ratingRepository
                        .existsByMember_MemberIdAndMovieId(
                                1L,
                                550L
                        )
        ).willReturn(true);

        CreateRatingRequest request =
                new CreateRatingRequest(
                        550L,
                        5,
                        "좋은 영화였습니다."
                );

        ApiException exception =
                catchThrowableOfType(
                        () -> ratingService.create(
                                1L,
                                request
                        ),
                        ApiException.class
                );

        assertThat(
                exception.getCode()
        ).isEqualTo(
                "RATING409_1"
        );

        verify(
                ratingRepository,
                never()
        ).save(
                any(Rating.class)
        );
    }

    @Test
    @DisplayName(
            "다른 회원의 평점을 수정하려 하면 RATING403_1 예외를 던진다"
    )
    void updateOtherMembersRating() {

        Member owner =
                mock(Member.class);

        Rating rating =
                mock(Rating.class);

        given(
                owner.getMemberId()
        ).willReturn(
                2L
        );

        given(
                rating.getMember()
        ).willReturn(
                owner
        );

        given(
                ratingRepository.findById(10L)
        ).willReturn(
                Optional.of(rating)
        );

        UpdateRatingRequest request =
                new UpdateRatingRequest(
                        4,
                        "수정하려는 후기"
                );

        ApiException exception =
                catchThrowableOfType(
                        () -> ratingService.update(
                                1L,
                                10L,
                                request
                        ),
                        ApiException.class
                );

        assertThat(
                exception.getCode()
        ).isEqualTo(
                "RATING403_1"
        );

        verify(
                ratingRepository,
                never()
        ).save(
                any(Rating.class)
        );
    }
}