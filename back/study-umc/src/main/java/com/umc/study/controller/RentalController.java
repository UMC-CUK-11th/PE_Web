package com.umc.study.controller;

import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {

    private final RentalService rentalService;

    @PostMapping
    public ResponseEntity<Void> createRental(@RequestBody CreateRentalRequest request) {
        if (request == null || request.userId() == null || request.bookId() == null
                || request.userId() <= 0 || request.bookId() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId and bookId must be positive integers");
        }

        rentalService.createRental(request.userId(), request.bookId());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    public record CreateRentalRequest(Long userId, Long bookId) {
    }
}
