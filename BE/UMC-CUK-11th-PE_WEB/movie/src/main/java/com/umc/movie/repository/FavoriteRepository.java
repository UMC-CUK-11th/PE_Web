package com.umc.movie.repository;

import com.umc.movie.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    // 내 즐겨찾기를 최근에 등록한 순서로 가져와요.
    List<Favorite> findByMember_MemberIdOrderByFavoriteIdDesc(Long memberId);

    Optional<Favorite> findByMember_MemberIdAndMovieId(Long memberId, Long movieId);

    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}
