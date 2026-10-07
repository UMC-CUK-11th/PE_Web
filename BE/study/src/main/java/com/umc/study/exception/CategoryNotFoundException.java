package com.umc.study.exception;

/**
 * 요청한 categoryId에 해당하는 카테고리가 없을 때 Service에서 발생시키는 예외입니다.
 */
public class CategoryNotFoundException extends RuntimeException {

    public CategoryNotFoundException(Long categoryId) {
        super("존재하지 않는 카테고리입니다. categoryId=" + categoryId);
    }
}
