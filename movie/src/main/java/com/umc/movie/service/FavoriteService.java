package com.umc.movie.service;

import com.umc.movie.dto.favorite.CreateFavoriteRequest;
import com.umc.movie.dto.favorite.FavoriteResponse;
import com.umc.movie.dto.favorite.FavoriteStatusResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public FavoriteResponse create(Long memberId, CreateFavoriteRequest request) { // [1]
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."));

        if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(HttpStatus.CONFLICT, "FAVORITE409_1",
                    "이미 이 영화를 즐겨찾기하셨습니다.");
        }

        Favorite favorite = Favorite.builder()
                .member(member)
                .movieId(request.movieId())
                .build();

        return FavoriteResponse.from(favoriteRepository.save(favorite));
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> getMyFavorites(Long memberId) { // [2]
        return favoriteRepository.findByMember_MemberIdOrderByFavoriteIdDesc(memberId).stream()
                .map(FavoriteResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public FavoriteStatusResponse getStatus(Long memberId, Long movieId) { // [3]
        boolean isFavorite = favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, movieId);
        return new FavoriteStatusResponse(isFavorite);
    }

    @Transactional
    public void delete(Long memberId, Long movieId) { // [4]
        Favorite favorite = favoriteRepository.findByMember_MemberIdAndMovieId(memberId, movieId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "FAVORITE404_1",
                        "즐겨찾기한 영화를 찾을 수 없습니다."));

        favoriteRepository.delete(favorite);
    }
}

/*
 * 공통: @Service로 Bean을 등록하고 Lombok 생성자를 통해 두 Repository를 주입받는다.
 * memberId는 컨트롤러가 인증된 요청 속성에서 받은 값이다. 클라이언트가 보낸 바디의 회원 ID가 아니다.
 *
 * [1] 회원 조회 → 중복 검사 → 회원·영화 관계 객체 생성 → 저장 → 응답 DTO 순서다.
 * findById는 Optional<Member>를 반환하며 없으면 orElseThrow가 MEMBER404_1 예외를 던진다.
 * 같은 회원·영화 조합이 이미 있으면 FAVORITE409_1로 명확한 실패 이유를 전달한다.
 * 사전 검사 뒤 동시 요청이 들어올 수 있으므로 DB의 복합 UNIQUE 제약도 유지해야 한다.
 * DB 제약 위반은 기존 DataIntegrityViolationException 핸들러의 공통 실패로 처리될 수 있다.
 * 따라서 모든 중복 상황이 반드시 이 사전 검사의 코드로 반환된다는 뜻은 아니다.
 * 빌더는 객체를 만들고 save가 DB 저장을 맡는다. from은 저장 결과를 FavoriteResponse로 변환한다.
 * @Transactional은 이 작업을 하나의 트랜잭션으로 묶는다. save 반환과 최종 커밋 시점은 구분한다.
 *
 * [2] 로그인한 회원의 즐겨찾기만 ID 내림차순으로 조회한다. 없으면 빈 리스트다.
 * stream → map(FavoriteResponse::from) → toList는 엔티티마다 DTO를 만들어 결과 목록으로 모으는 과정이다.
 * readOnly=true는 조회 작업에 대한 설정이지 HTTP 메서드나 접근 권한 설정은 아니다.
 * 이 워크북 메서드는 별도 회원 존재 조회 없이 즐겨찾기 목록을 바로 조회한다.
 *
 * [3] 회원·영화 조합의 존재 여부를 DTO에 담는다. 즐겨찾기하지 않았으면 false라는 정상 결과다.
 * 상세 화면의 버튼 상태에 사용할 수 있다. 해제할 데이터가 없어서 실패하는 [4]와 구분한다.
 *
 * [4] favoriteId가 아니라 인증 회원 ID와 경로의 TMDB movieId를 함께 조건으로 사용한다.
 * 내 즐겨찾기 행이 없으면 FAVORITE404_1, 있으면 해당 엔티티를 삭제한다.
 * 다른 회원의 행을 찾지 않으므로 별도로 남의 favoriteId를 받아 소유자를 비교하는 구조가 아니다.
 * 반환 타입 void는 서비스가 결과 데이터를 주지 않는다는 뜻이며 HTTP 204를 뜻하지 않는다.
 * 컨트롤러가 200과 result=null인 공통 응답을 만든다.
 */
