package com.umc.study.controller;

import com.umc.study.service.RentalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/rentals")
@RequiredArgsConstructor
public class RentalController {
    private final RentalService rentalService;

    // 필수 2: POST /rentals, userId와 bookId를 받는다.
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Map<String, Object> createRental(@RequestBody Map<String, Object> body) {
        return rentalService.createRental(body);
    }

    // 선택: PATCH /rentals/{rentalId}/return
    @PatchMapping("/{rentalId}/return")
    public Map<String, Object> returnBook(@PathVariable long rentalId) {
        return rentalService.returnBook(rentalId);
    }
}
