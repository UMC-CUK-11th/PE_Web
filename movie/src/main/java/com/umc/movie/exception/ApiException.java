package com.umc.movie.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter // [1]
public class ApiException extends RuntimeException { // [2]

    private final HttpStatus status;
    private final String code;

    public ApiException(HttpStatus status, String code, String message) { // [3]
        super(message);
        this.status = status;
        this.code = code;
    }
}

/*
 * [1] Lombok이 status와 code를 읽는 getStatus(), getCode()를 만들어준다.
 * getMessage()는 여기서 만드는 것이 아니라 부모 예외 클래스에서 상속받는다.
 *
 * [2] Java의 RuntimeException을 상속한 사용자 정의 예외다.
 * HTTP 상태와 응답 코드 문자열을 함께 담아 throw로 던질 수 있다.
 * status는 실제 HTTP 응답 상태, code는 응답 본문에 넣을 서비스 코드다.
 * code 문자열에 401을 적는다고 실제 HTTP 상태가 자동으로 401이 되는 것은 아니다.
 *
 * [3] 서비스 등에서 new ApiException(status, code, message)로 이 생성자를 호출한다.
 * super(message)는 부모 RuntimeException의 생성자에 메시지를 전달해 저장한다.
 * this.status와 this.code에는 전달받은 상태와 코드를 저장한다.
 * 예: throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401", "로그인이 필요합니다.");
 * new는 예외 객체를 만들고, throw는 그 객체를 던져 현재 정상 실행 흐름을 중단한다.
 * 컨트롤러 요청 처리 중 전역 처리기까지 전달되면 handleApiException이 받아 응답으로 바꾼다.
 */
