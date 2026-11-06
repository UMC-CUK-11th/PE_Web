-- MySQL 8.0 / 신규 DB 또는 누락된 테이블용. 기존 테이블과 데이터는 삭제하지 않습니다.
CREATE DATABASE IF NOT EXISTS umc_movie CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE umc_movie;

CREATE TABLE IF NOT EXISTS member (
    member_id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(254) NOT NULL,
    password VARCHAR(60) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (member_id),
    CONSTRAINT uk_member_email UNIQUE (email),
    CONSTRAINT uk_member_nickname UNIQUE (nickname)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rating (
    rating_id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL COMMENT 'TMDB ID; local movie FK is intentionally absent',
    score TINYINT NOT NULL,
    comment TEXT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (rating_id),
    CONSTRAINT uk_rating_member_movie UNIQUE (member_id, movie_id),
    CONSTRAINT fk_rating_member FOREIGN KEY (member_id) REFERENCES member (member_id),
    CONSTRAINT chk_rating_score CHECK (score BETWEEN 1 AND 5),
    CONSTRAINT chk_rating_movie CHECK (movie_id > 0),
    CONSTRAINT chk_rating_comment CHECK (comment IS NULL OR CHAR_LENGTH(comment) <= 500)
) ENGINE=InnoDB;

-- IF NOT EXISTS는 이미 있는 테이블의 구조를 바꾸지 않습니다. 기존 DB는 반드시 아래 결과를 확인하세요.
SHOW CREATE TABLE member;
SHOW CREATE TABLE rating;
SHOW INDEX FROM member;
SHOW INDEX FROM rating;

-- 비밀번호 원문/해시를 출력하지 않고 길이와 해시 접두사만 확인합니다.
SELECT member_id, email, nickname, CHAR_LENGTH(password) AS password_length,
       (password LIKE '$2%') AS looks_like_bcrypt
FROM member;
SELECT member_id, movie_id, COUNT(*) AS duplicate_count
FROM rating GROUP BY member_id, movie_id HAVING COUNT(*) > 1;
