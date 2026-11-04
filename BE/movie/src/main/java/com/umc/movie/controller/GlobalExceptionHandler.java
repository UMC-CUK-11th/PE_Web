package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> validation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage()).findFirst().orElse("잘못된 입력입니다.");
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON400", message));
    }

    @ExceptionHandler({HttpMessageNotReadableException.class, MethodArgumentTypeMismatchException.class})
    public ResponseEntity<ApiResponse<Void>> malformedInput(Exception exception) {
        return ResponseEntity.badRequest().body(ApiResponse.failure("COMMON400", "요청 값의 형식이 올바르지 않습니다."));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> duplicate(DataIntegrityViolationException exception) {
        return ResponseEntity.status(409).body(ApiResponse.failure("COMMON409", "이미 존재하는 데이터입니다."));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> responseStatus(ResponseStatusException exception) {
        int status = exception.getStatusCode().value();
        return ResponseEntity.status(status)
                .body(ApiResponse.failure("COMMON" + status, exception.getReason()));
    }
}
