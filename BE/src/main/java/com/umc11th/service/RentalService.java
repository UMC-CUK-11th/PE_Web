package com.umc11th.service;

import com.umc11th.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class RentalService {

    private final RentalRepository rentalRepository;

    public void createRental(Map<String, Object> body) {
        rentalRepository.save(body.get("userId"), body.get("bookId"));
    }

    public void returnRental(Long rentalId) {
        rentalRepository.updateReturnedAt(rentalId);
    }
}
