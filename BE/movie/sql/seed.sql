USE umc_movie;
-- 아래 문자열은 인증에 사용할 수 없는 더미 표식이다. 실제 비밀번호/해시가 아니다.
INSERT INTO member (email, password, nickname, created_at, updated_at)
SELECT 'noco@umc.com', 'TEST_ONLY_NOT_A_PASSWORD', '수현', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM member WHERE email = 'noco@umc.com' OR nickname = '수현');

INSERT INTO member (email, password, nickname, created_at, updated_at)
SELECT 'minseo@umc.com', 'TEST_ONLY_NOT_A_PASSWORD', '민서', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM member WHERE email = 'minseo@umc.com' OR nickname = '민서');

INSERT INTO rating (member_id, movie_id, score, comment, created_at, updated_at)
SELECT m.member_id, 550, 5, '최고의 영화!', NOW(), NOW() FROM member m
WHERE m.email = 'noco@umc.com'
AND NOT EXISTS (SELECT 1 FROM rating r WHERE r.member_id = m.member_id AND r.movie_id = 550);

INSERT INTO rating (member_id, movie_id, score, comment, created_at, updated_at)
SELECT m.member_id, 155, 4, '다시 봐도 명작', NOW(), NOW() FROM member m
WHERE m.email = 'noco@umc.com'
AND NOT EXISTS (SELECT 1 FROM rating r WHERE r.member_id = m.member_id AND r.movie_id = 155);

INSERT INTO rating (member_id, movie_id, score, comment, created_at, updated_at)
SELECT m.member_id, 550, 3, '호불호가 갈릴 것 같아요', NOW(), NOW() FROM member m
WHERE m.email = 'minseo@umc.com'
AND NOT EXISTS (SELECT 1 FROM rating r WHERE r.member_id = m.member_id AND r.movie_id = 550);
