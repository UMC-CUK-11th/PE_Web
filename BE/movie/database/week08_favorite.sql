-- MySQL 8.0: 기존 member/rating 데이터는 유지하고 즐겨찾기 테이블만 추가합니다.
USE umc_movie;
CREATE TABLE IF NOT EXISTS favorite (
    favorite_id BIGINT NOT NULL AUTO_INCREMENT,
    member_id BIGINT NOT NULL,
    movie_id BIGINT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (favorite_id),
    CONSTRAINT uk_favorite_member_movie UNIQUE (member_id, movie_id),
    CONSTRAINT fk_favorite_member FOREIGN KEY (member_id) REFERENCES member(member_id),
    CONSTRAINT chk_favorite_movie CHECK (movie_id > 0)
) ENGINE=InnoDB;
SHOW CREATE TABLE favorite;
