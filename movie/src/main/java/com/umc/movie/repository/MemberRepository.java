// src/main/java/com/umc/movie/repository/MemberRepository.java
package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // Java 기본 제공: 값이 있거나 없음을 표현하는 타입

public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByNickname(String nickname); // [1]
    boolean existsByEmail(String email); // [2]
    Optional<Member> findByEmail(String email); // [3]
    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId); // [4]
}

/*
 * 메서드 이름으로 조건을 표현하는 쿼리 메서드(파생 쿼리)다.
 * Spring Data JPA가 이름을 해석해 조회를 구성하므로 우리가 구현 클래스나 SQL을 직접 작성하지 않는다.
 * 이름의 기준은 DB 컬럼명이 아니라 엔티티의 Java 필드명이다.
 *
 * [1] existsByNickname: "전달한 nickname과 같은 회원이 존재하는가?"
 * exists는 존재 여부 확인, By 뒤의 Nickname은 Member.nickname을 조건으로 사용한다는 뜻이다.
 * nickname 인자의 값이 조건에 들어가며, 회원이 있으면 true, 없으면 false를 반환한다.
 * 이 결과는 중복 여부다. API의 available(사용 가능 여부)을 만들 때는 !결과로 반대로 바꾼다.
 *
 * [2] existsByEmail: "전달한 email과 같은 회원이 존재하는가?"
 * [1]과 같은 방식으로 Member.email을 조건으로 사용한다.
 * 같은 이메일이 있으면 true(중복), 없으면 false(사용 가능)를 반환한다.
 *
 * [3] findByEmail: email 조건으로 회원 객체 자체를 조회한다.
 * existsByEmail이 boolean만 반환하는 것과 달리, 로그인에 필요한 비밀번호 해시·ID·닉네임을 얻을 수 있다.
 * Optional<Member>는 회원이 있으면 Member를 담고, 없으면 비어 있는 조회 결과다.
 * 서비스가 orElseThrow로 회원을 꺼내거나, 비어 있으면 로그인 실패 예외를 던진다.
 *
 * [4] 닉네임이 같고(Nickname) 동시에(And) 회원 ID가 다른(MemberIdNot) 회원의 존재 여부를 확인한다.
 * 예: 1번 회원의 현재 닉네임이 영화광이면 ("영화광", 1L)은 자신을 제외하므로 false다.
 * 다른 회원이 사용하는 닉네임을 전달하면 true이므로 서비스에서 중복 예외를 던진다.
 */
