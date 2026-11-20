package com.umc.movie.repository;

import com.umc.movie.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> { // [1]
    List<Favorite> findByMember_MemberIdOrderByFavoriteIdDesc(Long memberId); // [2]
    Optional<Favorite> findByMember_MemberIdAndMovieId(Long memberId, Long movieId); // [3]
    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId); // [4]
}

/*
 * [1] Favorite 엔티티와 PK 타입 Long을 지정한다. save·findById·delete 등 기본 메서드를 상속한다.
 * 아래는 Spring Data JPA가 이름을 읽어 쿼리를 만드는 파생 쿼리다. SQL 컬럼명이 아니라 Java 필드를 따른다.
 *
 * [2] Favorite.member.memberId가 전달한 ID와 같은 목록을 favoriteId 내림차순으로 조회한다.
 * Member_MemberId의 밑줄은 연관 객체의 필드로 이동하는 경계를 명시한다.
 * 없으면 빈 목록이며, 최신 ID부터 정렬한다. 여기서 memberId는 이후 서비스가 인증 정보로 전달할 값이다.
 *
 * [3] 같은 회원 AND 같은 영화인 행을 찾는다. 있으면 Favorite를 담은 Optional, 없으면 빈 Optional이다.
 * 삭제할 때 영화 번호만 보지 않고 회원도 함께 조건에 넣어 자신의 즐겨찾기만 찾을 수 있다.
 * movieId와 favoriteId는 다르다. 이번 API 경로의 번호는 TMDB 영화 ID다.
 *
 * [4] [3]과 조건은 같지만 엔티티 대신 존재 여부만 반환한다.
 * 중복 등록이나 즐겨찾기 여부를 검사할 때 사용한다. false 자체가 오류는 아니다.
 */
