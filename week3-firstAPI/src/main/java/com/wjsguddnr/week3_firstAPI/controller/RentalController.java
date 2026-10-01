package com.wjsguddnr.week3_firstAPI.controller;

import com.wjsguddnr.week3_firstAPI.service.RentalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/rentals")
public class RentalController {

    private final RentalService rentalService;

    public RentalController(RentalService rentalService) {
        this.rentalService = rentalService;
    }

    @PostMapping
    public ResponseEntity<String> createRental(@RequestBody Map<String, Object> body) {
        rentalService.createRental(body);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body("도서 대여 기록이 생성되었습니다!");
    }
}
