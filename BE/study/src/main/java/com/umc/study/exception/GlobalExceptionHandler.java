package com.umc.study.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Controller 밖으로 나온 예외를 HTTP 상태 코드와 이해하기 쉬운 JSON으로 바꿉니다.
 * 이 클래스 덕분에 Controller마다 같은 try-catch를 반복하지 않아도 됩니다.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> fieldErrors = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors().forEach(error ->
                fieldErrors.putIfAbsent(error.getField(), error.getDefaultMessage())
        );

        ApiErrorResponse response = new ApiErrorResponse(
                "INVALID_REQUEST",
                "요청 값을 확인해 주세요.",
                fieldErrors
        );
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleUnreadableRequest(HttpMessageNotReadableException exception) {
        return ResponseEntity.badRequest().body(
                ApiErrorResponse.of("INVALID_REQUEST", "요청 JSON의 형식과 값 타입을 확인해 주세요.")
        );
    }

    @ExceptionHandler(CategoryNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleCategoryNotFound(CategoryNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                ApiErrorResponse.of("CATEGORY_NOT_FOUND", exception.getMessage())
        );
    }

    @ExceptionHandler(DuplicateBookTitleException.class)
    public ResponseEntity<ApiErrorResponse> handleDuplicateTitle(DuplicateBookTitleException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                ApiErrorResponse.of("DUPLICATE_BOOK_TITLE", exception.getMessage())
        );
    }
}
