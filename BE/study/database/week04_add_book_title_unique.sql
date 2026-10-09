-- 4주차 선택 실습: 같은 제목의 도서가 중복 저장되지 않도록 DB에도 안전장치를 둡니다.
-- 이 프로젝트는 Flyway를 사용하지 않으므로 로컬 학습 DB에서 한 번만 실행하는 기록용 SQL입니다.

-- 변경 전 확인: 같은 제목이 두 건 이상이면 UNIQUE 제약을 바로 추가할 수 없습니다.
SELECT title, COUNT(*) AS duplicate_count
FROM book
GROUP BY title
HAVING COUNT(*) > 1;

-- 현재 로컬 더미 데이터에서 4번과 모든 내용이 같은 최신 중복 5번만 정확히 제거합니다.
-- 조건이 하나라도 달라졌다면 삭제되지 않으므로 다른 데이터를 실수로 지우지 않습니다.
DELETE FROM book
WHERE book_id = 5
  AND category_id = 1
  AND title = '클린 코드'
  AND description = '애자일 소프트웨어 장인 정신'
  AND is_available = TRUE;

-- 영향받은 행이 반드시 1인지 확인한 뒤 다음 문장을 실행해야 합니다.
SELECT ROW_COUNT() AS deleted_duplicate_count;

ALTER TABLE book
    ADD CONSTRAINT uk_book_title UNIQUE (title);

-- 적용 결과 확인: uk_book_title 인덱스가 표시되어야 합니다.
SHOW INDEX FROM book WHERE Key_name = 'uk_book_title';
