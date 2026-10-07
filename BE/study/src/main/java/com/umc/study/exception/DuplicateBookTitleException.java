package com.umc.study.exception;

/**
 * 이미 등록된 제목을 다시 저장하려 할 때 409 Conflict로 변환할 예외입니다.
 */
public class DuplicateBookTitleException extends RuntimeException {

    public DuplicateBookTitleException(String title) {
        super("이미 등록된 도서 제목입니다. title=" + title);
    }

    public DuplicateBookTitleException(String title, Throwable cause) {
        super("이미 등록된 도서 제목입니다. title=" + title, cause);
    }
}
