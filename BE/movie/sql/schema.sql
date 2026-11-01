CREATE DATABASE IF NOT EXISTS umc_movie
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE umc_movie;

CREATE TABLE IF NOT EXISTS member (
  member_id BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(254) NOT NULL,
  password VARCHAR(60) NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (member_id),
  UNIQUE KEY uk_member_email (email),
  UNIQUE KEY uk_member_nickname (nickname)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rating (
  rating_id BIGINT NOT NULL AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  movie_id BIGINT NOT NULL,
  score TINYINT NOT NULL,
  comment TEXT,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (rating_id),
  CONSTRAINT fk_rating_member FOREIGN KEY (member_id) REFERENCES member(member_id),
  UNIQUE KEY uk_rating_member_movie (member_id, movie_id)
) ENGINE=InnoDB;

-- 8주차용 스키마만 생성. 이번 주차에는 Entity/API를 만들지 않는다.
CREATE TABLE IF NOT EXISTS favorite (
  favorite_id BIGINT NOT NULL AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  movie_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (favorite_id),
  CONSTRAINT fk_favorite_member FOREIGN KEY (member_id) REFERENCES member(member_id),
  UNIQUE KEY uk_favorite_member_movie (member_id, movie_id)
) ENGINE=InnoDB;
