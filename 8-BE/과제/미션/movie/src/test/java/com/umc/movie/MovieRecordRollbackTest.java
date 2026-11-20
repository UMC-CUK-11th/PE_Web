package com.umc.movie;

import com.umc.movie.dto.CreateMovieRecordRequest;
import com.umc.movie.entity.Favorite;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.service.MovieRecordService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;

// 테스트 트랜잭션 없이 실제로 commit/rollback되는 결과를 DB에서 확인한다
@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:mysql://127.0.0.1:3307/umc_movie_test?connectionTimeZone=Asia/Seoul&createDatabaseIfNotExist=true",
    "spring.sql.init.mode=always",
    "spring.sql.init.schema-locations=classpath:test-schema.sql",
    "jwt.secret=" + MemberApiTest.SECRET,
    "jwt.access-expiration=3600"
})
class MovieRecordRollbackTest {

    @Autowired MovieRecordService movieRecordService;
    @Autowired JdbcTemplate jdbc;
    @MockitoSpyBean FavoriteRepository favoriteRepository;

    @BeforeEach
    void seed() {
        jdbc.update("INSERT INTO member (member_id, email, password, nickname) VALUES "
            + "(1, 'noco@umc.com', '$2a$10$dummyEncodedPasswordValue', '수현')");
    }

    @AfterEach
    void clean() {
        jdbc.update("DELETE FROM favorite");
        jdbc.update("DELETE FROM rating");
        jdbc.update("DELETE FROM member");
    }

    @Test
    void ratingIsRolledBackWhenSavingTheFavoriteFails() {
        // 평점 저장 뒤 즐겨찾기 저장이 DB에서 거절된 상황을 만든다
        doThrow(new IllegalStateException("favorite insert failed"))
            .when(favoriteRepository).saveAndFlush(any(Favorite.class));

        assertThrows(IllegalStateException.class, () -> movieRecordService.create(1L,
            new CreateMovieRecordRequest(238L, 5, "다시 보고 싶은 영화입니다.", true)));

        assertEquals(0, jdbc.queryForObject("SELECT COUNT(*) FROM rating WHERE member_id = 1", Integer.class));
        assertEquals(0, jdbc.queryForObject("SELECT COUNT(*) FROM favorite WHERE member_id = 1", Integer.class));
    }

    @Test
    void bothRowsAreCommittedWhenEverythingSucceeds() {
        movieRecordService.create(1L, new CreateMovieRecordRequest(238L, 5, null, true));

        assertEquals(1, jdbc.queryForObject("SELECT COUNT(*) FROM rating WHERE member_id = 1 AND movie_id = 238", Integer.class));
        assertEquals(1, jdbc.queryForObject("SELECT COUNT(*) FROM favorite WHERE member_id = 1 AND movie_id = 238", Integer.class));
    }
}
