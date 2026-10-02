USE umc_week03;

INSERT INTO users (nickname)
VALUES ('민서'), ('수현');

INSERT INTO category (name)
VALUES ('문학'), ('과학');

INSERT INTO book (category_id, title, description, is_available)
VALUES (1, '달빛 도서관', '소설', TRUE), (1, '겨울의 편지', '에세이', FALSE), (2, '우주를 읽는 법', '과학 교양', TRUE);
