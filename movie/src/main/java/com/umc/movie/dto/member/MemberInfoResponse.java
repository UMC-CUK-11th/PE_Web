package com.umc.movie.dto.member;

import com.umc.movie.entity.Member; // 프로젝트: DB 회원 정보를 담는 엔티티
import java.time.LocalDateTime; // Java 기본 제공: 날짜와 시각 표현

public record MemberInfoResponse(
        String email,
        String nickname,
        LocalDateTime createdAt
) {
    // 비밀번호가 응답에 포함되지 않도록 필요한 정보만 옮깁니다.
    public static MemberInfoResponse from(Member member) { // [1]
        return new MemberInfoResponse(
                member.getEmail(),
                member.getNickname(),
                member.getCreatedAt()
        );
    }
}

/*
 * [1] 회원 엔티티에서 이메일·닉네임·가입 시각만 꺼내 응답 DTO로 옮긴다.
 * createdAt은 Member가 상속한 BaseTimeEntity에서 가져온다.
 * 엔티티를 그대로 응답하지 않고 필요한 값만 선택하므로 비밀번호 해시가 응답에 포함되지 않는다.
 * 서비스가 from(member)로 DTO를 만들고, 컨트롤러가 이를 공통 응답의 result에 담는다.
 */
