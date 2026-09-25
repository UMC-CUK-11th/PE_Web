package com.wjsguddnr.week3_firstAPI.service;

import com.wjsguddnr.week3_firstAPI.repository.RentalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class RentalService {

    private final RentalRepository rentalRepository;

    public RentalService(RentalRepository rentalRepository) {
        this.rentalRepository = rentalRepository;
    }

    public void createRental(Map<String, Object> body) {
        Long userId = getRequiredLong(body, "userId");
        Long bookId = getRequiredLong(body, "bookId");

        rentalRepository.save(userId, bookId);
    }

    private Long getRequiredLong(Map<String, Object> body, String key) {
        Object value = body.get(key);

        if (value == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    key + "는 필수입니다."
            );
        }

        try {
            return Long.valueOf(value.toString());
        } catch (NumberFormatException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    key + "는 숫자여야 합니다."
            );
        }
    }
}
