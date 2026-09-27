package com.umc.umc11th_workbook.domain.member.repository;

import com.umc.umc11th_workbook.domain.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {

}
