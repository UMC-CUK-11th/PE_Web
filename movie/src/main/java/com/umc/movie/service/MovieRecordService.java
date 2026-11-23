package com.umc.movie.service;

import com.umc.movie.dto.movierecord.CreateMovieRecordRequest;
import com.umc.movie.dto.favorite.FavoriteResponse;
import com.umc.movie.dto.movierecord.MovieRecordResponse;
import com.umc.movie.dto.rating.RatingResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MovieRecordService {

    private final MemberRepository memberRepository;
    private final RatingRepository ratingRepository;
    private final FavoriteRepository favoriteRepository;

    @Transactional // [1]
    public MovieRecordResponse create(Long memberId, CreateMovieRecordRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));

        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) { // [2]
            throw new ApiException(HttpStatus.CONFLICT, "RATING409_1",
                    "이미 이 영화에 평점을 남기셨습니다.");
        }

        if (request.addToFavorites()
                && favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1",
                    "이미 이 영화를 즐겨찾기하셨습니다.");
        }

        Rating rating = Rating.builder() // [3]
                .member(member)
                .movieId(request.movieId())
                .score(request.score())
                .comment(request.comment())
                .build();
        Rating savedRating = ratingRepository.save(rating);

        FavoriteResponse favoriteResponse = null; // [4]
        if (request.addToFavorites()) {
            Favorite favorite = Favorite.builder()
                    .member(member)
                    .movieId(request.movieId())
                    .build();
            Favorite savedFavorite = favoriteRepository.save(favorite);
            favoriteResponse = FavoriteResponse.from(savedFavorite);
        }

        return new MovieRecordResponse( // [5]
                RatingResponse.from(savedRating),
                favoriteResponse
        );
    }
}

/*
 * [1] SQLD에서 배운 여러 작업의 commit·rollback 경계를 서비스 메서드에 표현한다.
 * 컨트롤러가 Spring 서비스 프록시를 통해 호출하면 회원 조회와 두 저장이 같은 트랜잭션에 참여한다.
 * 정상 반환 후 커밋도 성공해야 최종 확정된다. 런타임 예외·Error가 밖으로 전파되면 기본적으로 롤백된다.
 * ApiException은 RuntimeException의 자식이다. 예외를 잡고 성공처럼 반환하지 않는다.
 * 같은 객체 안에서 this.create(...)로 직접 호출하면 기본 프록시 방식의 트랜잭션을 거치지 않는다.
 *
 * 트랜잭션 없는 호출부에서 두 서비스의 저장 메서드를 연달아 실행하면 각각 커밋될 수 있다.
 * 단, 외부에 이미 트랜잭션이 있고 하위 서비스가 기본 REQUIRED라면 같은 트랜잭션에 참여한다.
 * 서비스가 다르다고 무조건 별도 트랜잭션인 것은 아니다. 여기서는 전용 서비스에서 Repository를 조합한다.
 * LAZY는 연관 조회 시점이고 @Transactional은 작업 범위다. 이번 핵심은 두 저장의 원자성이다.
 *
 * [2] 회원을 조회하고 평점 중복은 항상, 즐겨찾기 중복은 추가를 선택했을 때만 검사한다.
 * &&는 앞이 false이면 뒤의 중복 조회를 실행하지 않는다. 기존 실패 코드를 재사용한다.
 * 사전 검사에서 막히면 저장 전이므로 이 경우만으로 INSERT 롤백을 검증했다고 볼 수 없다.
 * 동시 요청에 대한 DB 복합 UNIQUE 제약도 유지해야 한다.
 *
 * [3] 평점을 만들고 저장한다. save로 INSERT와 ID 생성이 끝나도 최종 커밋과는 다르다.
 * 이후 즐겨찾기 저장이나 트랜잭션 완료 과정에서 실패하면 앞의 평점도 롤백된다.
 *
 * [4] true일 때만 즐겨찾기를 저장하고 응답 DTO를 만든다. false이면 null을 유지한다.
 * 두 저장에 같은 회원 객체와 TMDB 영화 번호를 사용한다.
 *
 * [5] 평점 DTO와 선택적인 즐겨찾기 DTO를 묶어 반환한다.
 * 메서드 본문이 반환한 뒤 프록시의 커밋까지 성공해야 컨트롤러가 정상 결과를 받는다.
 */
