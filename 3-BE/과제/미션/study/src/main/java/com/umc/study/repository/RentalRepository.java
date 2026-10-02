package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.stereotype.Repository;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class RentalRepository {
    private final JdbcTemplate jdbcTemplate;

    public boolean userExists(long userId) {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM users WHERE user_id = ?", Integer.class, userId) > 0;
    }

    public boolean bookExists(long bookId) {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM book WHERE book_id = ?", Integer.class, bookId) > 0;
    }

    public Map<String, Object> save(long userId, long bookId) {
        var keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            var statement = connection.prepareStatement(
                "INSERT INTO rental (user_id, book_id, rented_at, due_at) VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))",
                Statement.RETURN_GENERATED_KEYS);
            statement.setLong(1, userId);
            statement.setLong(2, bookId);
            return statement;
        }, keyHolder);
        return findById(keyHolder.getKey().longValue()).getFirst();
    }

    public List<Map<String, Object>> findById(long rentalId) {
        return jdbcTemplate.queryForList("SELECT * FROM rental WHERE rental_id = ?", rentalId);
    }

    public Map<String, Object> returnBook(long rentalId) {
        jdbcTemplate.update("UPDATE rental SET returned_at = NOW() WHERE rental_id = ?", rentalId);
        return findById(rentalId).getFirst();
    }
}
