package com.umc.study;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:mysql://127.0.0.1:3307/umc_week03_test?connectionTimeZone=Asia/Seoul&createDatabaseIfNotExist=true",
    "spring.sql.init.mode=always",
    "spring.sql.init.schema-locations=classpath:test-schema.sql"
})
@AutoConfigureMockMvc
@Transactional
class BookApiTest {
    @Autowired MockMvc mvc;
    @Autowired JdbcTemplate jdbc;

    @BeforeEach
    void seed() {
        jdbc.update("INSERT INTO category (category_id, name) VALUES (201, '문학'), (202, '과학')");
        jdbc.update("INSERT INTO users (user_id, nickname) VALUES (201, '테스트 회원')");
        jdbc.update("INSERT INTO book (book_id, category_id, title) VALUES (201, 201, '문학 도서'), (202, 202, '과학 도서')");
    }

    @Test
    void categoryFiltersBooks() throws Exception {
        mvc.perform(get("/books/category/201")).andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(1)).andExpect(jsonPath("$[0].title").value("문학 도서"));
        mvc.perform(get("/books/category/999")).andExpect(status().isOk()).andExpect(content().json("[]"));
    }

    @Test
    void rentalSavesSevenDayDueDateAndReturnChangesOnlyTarget() throws Exception {
        mvc.perform(post("/rentals").contentType("application/json").content("{\"userId\":201,\"bookId\":201}"))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.rental_id").isNumber());
        Long id = jdbc.queryForObject("SELECT rental_id FROM rental WHERE user_id = 201", Long.class);
        assertEquals(7, jdbc.queryForObject("SELECT TIMESTAMPDIFF(DAY, rented_at, due_at) FROM rental WHERE rental_id = ?", Integer.class, id));
        jdbc.update("INSERT INTO rental (user_id, book_id, rented_at, due_at) VALUES (201, 202, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))");
        mvc.perform(patch("/rentals/" + id + "/return")).andExpect(status().isOk())
            .andExpect(jsonPath("$.returned_at").isNotEmpty());
        assertEquals(1, jdbc.queryForObject("SELECT COUNT(*) FROM rental WHERE user_id = 201 AND returned_at IS NULL", Integer.class));
    }

    @Test
    void invalidBodyDoesNotInsertRental() throws Exception {
        for (String body : new String[]{"{}", "{\"userId\":201,\"bookId\":0}", "{\"userId\":\"201 OR 1=1\",\"bookId\":201}", "{\"userId\":201.5,\"bookId\":201}"}) {
            mvc.perform(post("/rentals").contentType("application/json").content(body)).andExpect(status().isBadRequest());
        }
        assertEquals(0, jdbc.queryForObject("SELECT COUNT(*) FROM rental WHERE user_id = 201", Integer.class));
    }

    @Test
    void missingRecordsReturn404() throws Exception {
        mvc.perform(post("/rentals").contentType("application/json").content("{\"userId\":999,\"bookId\":201}"))
            .andExpect(status().isNotFound());
        mvc.perform(patch("/rentals/999/return")).andExpect(status().isNotFound());
    }

    @Test
    void studyBookCreationAndSqlBinding() throws Exception {
        mvc.perform(post("/books").contentType("application/json").content("{\"categoryId\":201,\"title\":\"O'Reilly\",\"description\":\"SQL 테스트\"}"))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.title").value("O'Reilly"));
        mvc.perform(get("/books")).andExpect(status().isOk()).andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void titleTypoReturns400WithoutInsertingBook() throws Exception {
        mvc.perform(post("/books").contentType("application/json").content("{\"categoryId\":201,\"titel\":\"클린 코드\"}"))
            .andExpect(status().isBadRequest());
        assertEquals(2, jdbc.queryForObject("SELECT COUNT(*) FROM book WHERE category_id IN (201, 202)", Integer.class));
    }
}
