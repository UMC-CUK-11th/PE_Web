package com.umc.umc11th_workbook.global;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;

public class GlobalExceptionHandler {
  // @Valid 검증 실패 시 발생하는 MethodArgumentNotValidException을 처리하는 핸들러 메서드
  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();

    // 에러가 발생한 필드(예: categoryIds)와 우리가 작성한 메시지를 Map에 담습니다.
    for (FieldError error : ex.getBindingResult().getFieldErrors()) {
      errors.put(error.getField(), error.getDefaultMessage());
    }

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
  }
}
