package com.umc.study.service;

import com.umc.study.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;
import static org.springframework.http.HttpStatus.*;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public List<Map<String, Object>> getAllBooks() {
        return bookRepository.findAll();
    }

    public List<Map<String, Object>> getBooksByCategory(long categoryId) {
        if (categoryId <= 0) throw new ResponseStatusException(BAD_REQUEST, "categoryId는 양수여야 합니다.");
        return bookRepository.findByCategory(categoryId);
    }

    public Map<String, Object> createBook(Map<String, Object> body) {
        long categoryId = InputValues.positiveId(body.get("categoryId"), "categoryId");
        if (!(body.get("title") instanceof String title) || title.isBlank() || title.length() > 100) {
            throw new ResponseStatusException(BAD_REQUEST, "title은 1~100자의 문자열이어야 합니다.");
        }
        Object description = body.get("description");
        if (description != null && !(description instanceof String)) {
            throw new ResponseStatusException(BAD_REQUEST, "description은 문자열이어야 합니다.");
        }
        if (!bookRepository.categoryExists(categoryId)) throw new ResponseStatusException(NOT_FOUND, "카테고리를 찾을 수 없습니다.");
        return bookRepository.save(categoryId, title.trim(), (String) description);
    }
}
