-- 기존 DB 점검용. 먼저 USE umc_movie; 실행 후 사용합니다.
-- 아래 중복 조회가 0행인지 먼저 확인하세요. 기존 데이터는 자동으로 삭제하지 않습니다.
SELECT email, COUNT(*) FROM member GROUP BY email HAVING COUNT(*) > 1;
SELECT nickname, COUNT(*) FROM member GROUP BY nickname HAVING COUNT(*) > 1;
SELECT member_id, movie_id, COUNT(*) FROM rating GROUP BY member_id, movie_id HAVING COUNT(*) > 1;
SELECT r.rating_id FROM rating r LEFT JOIN member m ON m.member_id = r.member_id WHERE m.member_id IS NULL;
SHOW CREATE TABLE member;
SHOW CREATE TABLE rating;

-- SHOW CREATE TABLE 결과에 해당 규칙이 없는 경우에만 필요한 문장을 선택 실행하세요.
-- ALTER TABLE member ADD CONSTRAINT uk_member_email UNIQUE (email);
-- ALTER TABLE member ADD CONSTRAINT uk_member_nickname UNIQUE (nickname);
-- ALTER TABLE rating ADD CONSTRAINT uk_rating_member_movie UNIQUE (member_id, movie_id);
-- ALTER TABLE rating ADD CONSTRAINT fk_rating_member FOREIGN KEY (member_id) REFERENCES member(member_id);
-- ALTER TABLE member MODIFY password VARCHAR(60) NOT NULL;
-- 기존 비밀번호가 평문이면 길이를 자르는 방식으로 바꾸지 말고 테스트 회원을 새 가입 API로 만드세요.
