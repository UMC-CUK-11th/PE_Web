package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByNickname(String nickname);
    boolean existsByEmail(String email);

    // 로그인할 때 이메일로 회원을 꺼내요.
    Optional<Member> findByEmail(String email);

    // 나를 제외하고 이 닉네임을 쓰는 회원이 있는지 확인해요. (내 정보 수정)
    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);
}
