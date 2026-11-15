
package com.umc.movie.repository;

import com.umc.movie.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    // 특정 회원의 즐겨찾기 목록을 최신 등록순으로 조회
    List<Favorite> findByMember_MemberIdOrderByFavoriteIdDesc(Long memberId);

    // 특정 회원이 즐겨찾기한 영화 조회
    Optional<Favorite> findByMember_MemberIdAndMovieId(
            Long memberId,
            Long movieId
    );

    // 특정 영화의 즐겨찾기 등록 여부 확인
    boolean existsByMember_MemberIdAndMovieId(
            Long memberId,
            Long movieId
    );
}
