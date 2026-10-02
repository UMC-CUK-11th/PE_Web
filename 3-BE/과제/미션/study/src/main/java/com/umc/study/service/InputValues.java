package com.umc.study.service;

import java.math.BigDecimal;
import org.springframework.web.server.ResponseStatusException;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

final class InputValues {
    private InputValues() {}

    static long positiveId(Object value, String name) {
        if (value instanceof Number number) {
            try {
                long id = new BigDecimal(number.toString()).longValueExact();
                if (id > 0) return id;
            } catch (ArithmeticException | NumberFormatException ignored) {
            }
        }
        throw new ResponseStatusException(BAD_REQUEST, name + "는 양의 정수여야 합니다.");
    }
}
