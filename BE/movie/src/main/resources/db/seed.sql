-- 빈 학습용 DB에 한 번만 실행한다. 비밀번호는 인증에 사용할 수 없는 더미 값이다.
INSERT INTO member (member_id, email, password, nickname) VALUES
(1, 'noco@umc.com', '$2a$10$dummyEncodedPasswordValue', '수현'),
(2, 'minseo@umc.com', '$2a$10$dummyEncodedPasswordValue', '민서'),
(3, 'empty@umc.com', '$2a$10$dummyEncodedPasswordValue', '평점없음');
INSERT INTO rating (rating_id, member_id, movie_id, score, comment, created_at, updated_at) VALUES
(1, 1, 550, 5, '최고의 영화!', '2026-08-26 10:00:00', '2026-08-26 10:00:00'),
(2, 1, 155, 4, '다시 봐도 명작', '2026-08-27 10:00:00', '2026-08-27 10:00:00'),
(3, 2, 550, 3, '호불호가 갈릴 것 같아요', '2026-08-28 10:00:00', '2026-08-28 10:00:00');
