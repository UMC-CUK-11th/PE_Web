-- 워크북의 더미 데이터. 실제 사용자 비밀번호가 아니다.
INSERT IGNORE INTO member (email, password, nickname) VALUES
('noco@umc.com', '$2a$10$dummyEncodedPasswordValue', '수현'),
('minseo@umc.com', '$2a$10$dummyEncodedPasswordValue', '민서');
INSERT IGNORE INTO rating (member_id, movie_id, score, comment)
SELECT member_id, 550, 5, '최고의 영화!' FROM member WHERE email = 'noco@umc.com';
INSERT IGNORE INTO rating (member_id, movie_id, score, comment)
SELECT member_id, 155, 4, '다시 봐도 명작' FROM member WHERE email = 'noco@umc.com';
INSERT IGNORE INTO rating (member_id, movie_id, score, comment)
SELECT member_id, 550, 3, '호불호가 갈릴 것 같아요' FROM member WHERE email = 'minseo@umc.com';
