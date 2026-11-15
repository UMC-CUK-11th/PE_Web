package com.umc11th.repository;

import com.umc11th.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    Optional<Member> findByEmail(String email);

    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);
}
