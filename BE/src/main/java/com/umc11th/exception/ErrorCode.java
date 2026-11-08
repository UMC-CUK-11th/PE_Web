package com.umc11th.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {
    DATA_CONFLICT(HttpStatus.CONFLICT, "COMMON4091", "이미 존재하는 데이터입니다."),
    MEMBER_EMAIL_DUPLICATE(HttpStatus.CONFLICT, "MEMBER4091", "이미 사용 중인 이메일입니다."),
    MEMBER_NICKNAME_DUPLICATE(HttpStatus.CONFLICT, "MEMBER4092", "이미 사용 중인 닉네임입니다."),
    MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "MEMBER4041", "존재하지 않는 유저입니다."),
    RATING_DUPLICATE(HttpStatus.CONFLICT, "RATING4091", "이미 이 영화에 평점을 남기셨습니다."),
    RATING_NOT_FOUND(HttpStatus.NOT_FOUND, "RATING4041", "존재하지 않는 평점입니다."),
    RATING_FORBIDDEN(
            HttpStatus.FORBIDDEN,
            "RATING4031",
            "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다."
    );

    private final HttpStatus status;
    private final String code;
    private final String message;

    ErrorCode(HttpStatus status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
