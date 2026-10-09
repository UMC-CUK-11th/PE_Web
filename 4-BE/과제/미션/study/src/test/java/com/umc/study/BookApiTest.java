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
    "spring.datasource.url=jdbc:mysql://127.0.0.1:3307/umc_week04_test?connectionTimeZone=Asia/Seoul&createDatabaseIfNotExist=true",
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
        jdbc.update("INSERT INTO book (book_id, category_id, title, is_available) VALUES (201, 201, '스프링 입문', true), (202, 202, '우주 이야기', false)");
    }

    @Test
    void listReturnsNewestFirstWithCategoryNameAndDtoFields() throws Exception {
        mvc.perform(get("/books")).andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].bookId").value(202))
            .andExpect(jsonPath("$[0].categoryName").value("과학"))
            .andExpect(jsonPath("$[0].isAvailable").value(false))
            .andExpect(jsonPath("$[0].book_id").doesNotExist())
            .andExpect(jsonPath("$[0].category").doesNotExist());
    }

    @Test
    void createsBookAndReturnsOnlyResponseDto() throws Exception {
        mvc.perform(post("/books").contentType("application/json")
                .content("{\"categoryId\":201,\"title\":\"O'Reilly\",\"description\":\"SQL과 ORM\"}"))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.bookId").isNumber())
            .andExpect(jsonPath("$.title").value("O'Reilly"))
            .andExpect(jsonPath("$.categoryName").value("문학"))
            .andExpect(jsonPath("$.isAvailable").value(true))
            .andExpect(jsonPath("$.category_id").doesNotExist());
        assertEquals(3, jdbc.queryForObject("SELECT COUNT(*) FROM book", Integer.class));
    }

    @Test
    void rejectsMissingBlankLongAndMalformedValuesWithoutSaving() throws Exception {
        String[] bodies = {"{}", "{\"categoryId\":201,\"title\":\"   \"}",
            "{\"categoryId\":201,\"title\":\"" + "가".repeat(101) + "\"}",
            "{\"categoryId\":201,\"titel\":\"오타\"}",
            "{\"categoryId\":201.5,\"title\":\"책\"}",
            "{\"categoryId\":-1,\"title\":\"책\"}"};
        for (String body : bodies) {
            mvc.perform(post("/books").contentType("application/json").content(body))
                .andExpect(status().isBadRequest());
        }
        assertEquals(2, jdbc.queryForObject("SELECT COUNT(*) FROM book", Integer.class));
    }

    @Test
    void missingCategoryReturns404WithoutSaving() throws Exception {
        mvc.perform(post("/books").contentType("application/json")
                .content("{\"categoryId\":999,\"title\":\"책\"}"))
            .andExpect(status().isNotFound());
        assertEquals(2, jdbc.queryForObject("SELECT COUNT(*) FROM book", Integer.class));
    }

    @Test
    void descriptionIsOptionalAndHundredCharacterTitleIsAccepted() throws Exception {
        mvc.perform(post("/books").contentType("application/json")
                .content("{\"categoryId\":201,\"title\":\"" + "가".repeat(100) + "\"}"))
            .andExpect(status().isCreated()).andExpect(jsonPath("$.description").isEmpty());
    }
}
