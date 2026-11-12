package com.umc.movie.repository;

import java.util.Optional;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional<Member> findByEmail(String email);

    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);

    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);
}
