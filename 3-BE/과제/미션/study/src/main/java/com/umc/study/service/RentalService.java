package com.umc.study.service;

import com.umc.study.repository.RentalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;
import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class RentalService {
    private final RentalRepository rentalRepository;

    @Transactional
    public Map<String, Object> createRental(Map<String, Object> body) {
        long userId = InputValues.positiveId(body.get("userId"), "userId");
        long bookId = InputValues.positiveId(body.get("bookId"), "bookId");
        if (!rentalRepository.userExists(userId)) throw new ResponseStatusException(NOT_FOUND, "회원을 찾을 수 없습니다.");
        if (!rentalRepository.bookExists(bookId)) throw new ResponseStatusException(NOT_FOUND, "도서를 찾을 수 없습니다.");
        return rentalRepository.save(userId, bookId);
    }

    @Transactional
    public Map<String, Object> returnBook(long rentalId) {
        if (rentalId <= 0) throw new ResponseStatusException(BAD_REQUEST, "rentalId는 양수여야 합니다.");
        if (rentalRepository.findById(rentalId).isEmpty()) throw new ResponseStatusException(NOT_FOUND, "대여 기록을 찾을 수 없습니다.");
        return rentalRepository.returnBook(rentalId);
    }
}
