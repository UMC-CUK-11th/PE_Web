package com.umc11th.repository;

import com.umc11th.entity.Rating;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Page<Rating> findByMember_MemberIdOrderByRatingIdDesc(Long memberId, Pageable pageable);

    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}
