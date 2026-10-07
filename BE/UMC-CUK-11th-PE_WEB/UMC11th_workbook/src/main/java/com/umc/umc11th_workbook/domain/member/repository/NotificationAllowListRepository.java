package com.umc.umc11th_workbook.domain.member.repository;

import com.umc.umc11th_workbook.domain.member.entity.NotificationAllowList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationAllowListRepository extends
    JpaRepository<NotificationAllowList, Long> {

}
