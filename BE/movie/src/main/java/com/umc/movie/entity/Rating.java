package com.umc.movie.entity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
@Entity
@Table(name = "rating", uniqueConstraints = @UniqueConstraint(name = "uk_rating_member_movie", columnNames = {"member_id", "movie_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Rating extends BaseTimeEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Long ratingId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;
    @Column(name = "movie_id", nullable = false)
    private Long movieId;
    // MySQL TINYINT와 Java Byte를 대응시킨다. 응답에서는 정수로 변환한다.
    @Column(nullable = false)
    private Byte score;
    @Column(columnDefinition = "TEXT")
    private String comment;
}
