package com.umc11th.controller;

import com.umc11th.dto.ApiResponse;
import com.umc11th.exception.BusinessException;
import com.umc11th.exception.ErrorCode;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException exception) {
        ErrorCode errorCode = exception.getErrorCode();
        return ResponseEntity.status(errorCode.getStatus())
                .body(ApiResponse.failure(errorCode.getCode(), errorCode.getMessage()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Void>> handleDataIntegrityViolation(
            DataIntegrityViolationException exception
    ) {
        String causeMessage = exception.getMostSpecificCause().getMessage();
        ErrorCode errorCode = resolveConstraintError(causeMessage);

        return ResponseEntity.status(errorCode.getStatus())
                .body(ApiResponse.failure(errorCode.getCode(), errorCode.getMessage()));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatusException(
            ResponseStatusException exception
    ) {
        String message = exception.getReason() == null
                ? "요청한 자원을 찾을 수 없습니다."
                : exception.getReason();

        return ResponseEntity.status(exception.getStatusCode())
                .body(ApiResponse.failure(
                        "COMMON" + exception.getStatusCode().value(),
                        message
                ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
            MethodArgumentNotValidException exception
    ) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getDefaultMessage())
                .orElse("잘못된 요청입니다.");

        return ResponseEntity.badRequest()
                .body(ApiResponse.failure("COMMON4001", message));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalArgumentException(
            IllegalArgumentException exception
    ) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.failure("COMMON4002", exception.getMessage()));
    }

    private ErrorCode resolveConstraintError(String causeMessage) {
        if (causeMessage.contains("uk_member_email")) {
            return ErrorCode.MEMBER_EMAIL_DUPLICATE;
        }
        if (causeMessage.contains("uk_member_nickname")) {
            return ErrorCode.MEMBER_NICKNAME_DUPLICATE;
        }
        if (causeMessage.contains("uk_rating_member_movie")) {
            return ErrorCode.RATING_DUPLICATE;
        }

        return ErrorCode.DATA_CONFLICT;
    }
}
