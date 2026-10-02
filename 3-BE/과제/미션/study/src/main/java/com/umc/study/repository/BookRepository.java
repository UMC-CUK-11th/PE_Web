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
public class BookRepository {
    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> findAll() {
        return jdbcTemplate.queryForList("SELECT * FROM book ORDER BY book_id");
    }

    public List<Map<String, Object>> findByCategory(long categoryId) {
        return jdbcTemplate.queryForList("SELECT * FROM book WHERE category_id = ? ORDER BY book_id", categoryId);
    }

    public boolean categoryExists(long categoryId) {
        return jdbcTemplate.queryForObject("SELECT COUNT(*) FROM category WHERE category_id = ?", Integer.class, categoryId) > 0;
    }

    public Map<String, Object> save(long categoryId, String title, String description) {
        var keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            var statement = connection.prepareStatement(
                "INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)",
                Statement.RETURN_GENERATED_KEYS);
            statement.setLong(1, categoryId);
            statement.setString(2, title);
            statement.setString(3, description);
            return statement;
        }, keyHolder);
        return jdbcTemplate.queryForMap("SELECT * FROM book WHERE book_id = ?", keyHolder.getKey().longValue());
    }
}
