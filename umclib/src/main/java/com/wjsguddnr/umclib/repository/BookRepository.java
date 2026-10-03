package com.wjsguddnr.umclib.repository;

import com.wjsguddnr.umclib.domain.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
//import java.util.Map;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    // JpaRepository<Book, Long>에서 Book은 이 Repository가 관리할 엔티티,
    // Long은 Book의 PK인 bookId의 자료형을 의미한다.
    // 이를 상속하면 findAll(), findById(), save(), deleteById() 같은 기본 CRUD 메서드를 직접 만들지 않아도 사용할 수 있다.

    @EntityGraph(attributePaths = "category")
    List<Book> findAllByOrderByBookIdDesc();
    // findAll: 모든 Book을 조회한다.
    // By: 조회 조건 부분의 시작을 알리지만, By 바로 뒤에 조건이 없으므로 필터링 조건은 없다.
    // OrderByBookIdDesc: bookId를 기준으로 내림차순 정렬한다.
    // Spring Data JPA가 메서드 이름을 분석해 SELECT ... FROM book ORDER BY book_id DESC 쿼리를 자동으로 만든다.
    // @EntityGraph는 응답에 필요한 Category도 Book 목록과 함께 조회해 LAZY로 인한 추가 쿼리를 줄인다.

    @EntityGraph(attributePaths = "category")
    List<Book> findAllByCategoryCategoryId(Long categoryId);
    // findAll: 조건에 맞는 모든 Book을 조회한다.
    // By: 이 뒤부터 조회 조건이 시작된다는 뜻이다.
    // CategoryCategoryId: Book의 category 필드로 들어가 Category의 categoryId 값과 비교한다.
    // Spring Data JPA가 WHERE category_id = ? 조건의 쿼리를 자동으로 만든다.
    // @EntityGraph는 BookResponse에서 categoryName을 사용할 수 있도록 Category도 함께 조회한다.
}

//===========================================================================================================
//3주차의 row sql repository
// 스프링 컨테이너에 "나 창고지기 부품이야!"라고 등록
//public class BookRepository {
//
//    // 2단계에서 준비된 스프링의 DB 통신 도구(JdbcTemplate) 주입
//    private final JdbcTemplate jdbcTemplate;
//
//    public BookRepository(JdbcTemplate jdbcTemplate) {
//        this.jdbcTemplate = jdbcTemplate;
//    }
//
//    public List<Map<String, Object>> findAll() {
//        String sql = "SELECT * FROM book";
//
//        // 쿼리를 실행하고 결과를 List<Map> 형태의 날것 데이터로 긁어옵니다.
//        // Map의 Key는 '컬럼명(title)', Value는 '실제 데이터(달빛 도서관)'가 됩니다.
//        return jdbcTemplate.queryForList(sql);
//    }
//
//    public List<Map<String, Object>> findBooksByCategoryId(Long categoryId) {
//        String sql = "SELECT * FROM book WHERE category_id = ?";
//        return jdbcTemplate.queryForList(sql, categoryId);
//    }
//
//    public void save(Map<String, Object> body){
//        // book_id는 AUTO_INCREMENT이므로 생략, is_available은 기본 true로 삽입
//        String sql = "INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)";
//
//        // SQL 뒤에 파라미터를 차례대로 넘겨주면 ? 자리에 순서대로 안전하게 바인딩됩니다.
//        jdbcTemplate.update(
//                sql,
//                body.get("categoryId"),
//                body.get("title"),
//                body.get("description")
//        );
//    }
//
//
//}
