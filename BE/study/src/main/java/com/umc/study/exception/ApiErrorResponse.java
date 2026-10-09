package com.umc.study.exception;

import java.util.Map;

/**
 * 실패 응답도 일정한 JSON 구조로 전달하기 위한 DTO입니다.
 * 검증 실패가 아니면 fieldErrors는 빈 객체로 반환됩니다.
 */
public record ApiErrorResponse(
        String code,
        String message,
        Map<String, String> fieldErrors
) {

    public static ApiErrorResponse of(String code, String message) {
        return new ApiErrorResponse(code, message, Map.of());
    }
}
