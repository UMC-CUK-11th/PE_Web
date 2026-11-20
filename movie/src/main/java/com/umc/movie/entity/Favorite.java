package com.umc.movie.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "favorite",
        uniqueConstraints = @UniqueConstraint(columnNames = {"member_id", "movie_id"})
) // [1]
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Favorite extends BaseTimeEntity { // [2]

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "favorite_id")
    private Long favoriteId;

    @ManyToOne(fetch = FetchType.LAZY) // [3]
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "movie_id", nullable = false) // [4]
    private Long movieId;

    @Builder
    public Favorite(Member member, Long movieId) { // [5]
        this.member = member;
        this.movieId = movieId;
    }
}

/*
 * [1] favorite는 영화 자체의 속성이 아니라 '어느 회원이 어떤 영화를 보관했는가'라는 관계다.
 * member_id와 movie_id를 한 쌍으로 UNIQUE 처리해 같은 회원의 같은 영화 중복 등록을 막는다.
 * movie_id 하나만 UNIQUE라면 다른 회원도 같은 영화를 즐겨찾기할 수 없게 되므로 복합 제약이 필요하다.
 * ddl-auto=validate는 테이블을 생성·수정하지 않는다. 실제 DB에도 컬럼·제약이 준비돼 있어야 한다.
 *
 * [2] BaseTimeEntity의 createdAt·updatedAt 매핑과 getter를 상속한다.
 * 부모 테이블을 따로 JOIN하는 것이 아니라 favorite 테이블의 시간 컬럼으로 매핑한다.
 * favoriteId는 DB의 AUTO_INCREMENT로 생성한다. protected 기본 생성자는 JPA가 객체를 만들 때 사용한다.
 *
 * [3] 여러 즐겨찾기가 한 회원에 속하므로 Rating과 같은 다대일 관계다.
 * Java에서는 Member 객체를 참조하고 DB에는 회원 PK를 member_id FK로 저장한다.
 * LAZY는 회원 정보가 필요할 때 조회하도록 하는 설정이지 인증 기능이 아니다.
 * 로그인한 회원을 확인해 연결하는 작업은 이후 인터셉터·서비스에서 수행한다.
 *
 * [4] TMDB가 제공한 영화 번호를 숫자로 보관한다. 우리 DB에 movie 테이블이 없어 FK가 아니다.
 * Member 관계와 달리 영화 엔티티를 연결하거나 @ManyToOne을 붙이지 않는다.
 *
 * [5] 생성자에 필요한 회원·영화 번호만 전달한다. 빌더는 이 생성자로 객체를 만드는 도구다.
 * 생성만으로 DB에 저장되지는 않는다. 이후 서비스가 repository.save를 호출한다.
 */
