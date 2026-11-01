USE umc_sql_practice;

CREATE TABLE IF NOT EXISTS member (
    member_id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(254) NOT NULL,
    password VARCHAR(60) NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (member_id),
    UNIQUE KEY uk_member_email (email),
    UNIQUE KEY uk_member_nickname (nickname)
);

CREATE TABLE IF NOT EXISTS rating (
    rating_id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    score TINYINT NOT NULL,
    comment TEXT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (rating_id),
    UNIQUE KEY uk_rating_member_movie (member_id, movie_id),
    CONSTRAINT fk_rating_member FOREIGN KEY (member_id) REFERENCES member (member_id)
);

CREATE TABLE IF NOT EXISTS favorite (
    favorite_id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (favorite_id),
    UNIQUE KEY uk_favorite_member_movie (member_id, movie_id),
    CONSTRAINT fk_favorite_member FOREIGN KEY (member_id) REFERENCES member (member_id)
);

INSERT IGNORE INTO member (member_id, email, password, nickname, created_at, updated_at)
VALUES (1, 'noco@umc.com', '123456789012345678901234567890123456789012345678901234567890', '수현', NOW(6), NOW(6));

INSERT IGNORE INTO rating (member_id, movie_id, score, comment, created_at, updated_at)
VALUES
    (1, 101, 5, '정말 재미있는 영화였습니다.', NOW(6), NOW(6)),
    (1, 102, 4, '배우들의 연기가 좋았습니다.', NOW(6), NOW(6));
