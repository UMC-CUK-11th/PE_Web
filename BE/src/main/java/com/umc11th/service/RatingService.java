package com.umc11th.service;

import com.umc11th.dto.CreateRatingRequest;
import com.umc11th.dto.RatingResponse;
import com.umc11th.dto.UpdateRatingRequest;
import com.umc11th.entity.Member;
import com.umc11th.entity.Rating;
import com.umc11th.exception.BusinessException;
import com.umc11th.exception.ErrorCode;
import com.umc11th.repository.MemberRepository;
import com.umc11th.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByMember(Long memberId, int page, int size) {
        if (!memberRepository.existsById(memberId)) {
            throw new BusinessException(ErrorCode.MEMBER_NOT_FOUND);
        }
        if (page < 0) {
            throw new IllegalArgumentException("page는 0 이상이어야 합니다.");
        }
        if (size < 1 || size > 100) {
            throw new IllegalArgumentException("size는 1 이상 100 이하여야 합니다.");
        }

        return ratingRepository
                .findByMember_MemberIdOrderByRatingIdDesc(memberId, PageRequest.of(page, size))
                .stream()
                .map(RatingResponse::from)
                .toList();
    }

    @Transactional
    public Long create(Long memberId, CreateRatingRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(ErrorCode.MEMBER_NOT_FOUND));

        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new BusinessException(ErrorCode.RATING_DUPLICATE);
        }

        Rating rating = Rating.builder()
                .member(member)
                .movieId(request.movieId())
                .score(request.score())
                .comment(request.comment())
                .build();

        return ratingRepository.save(rating).getRatingId();
    }

    @Transactional
    public void update(Long ratingId, Long memberId, UpdateRatingRequest request) {
        Rating rating = findOwnedRating(ratingId, memberId);
        rating.update(request.score(), request.comment());
    }

    @Transactional
    public void delete(Long ratingId, Long memberId) {
        Rating rating = findOwnedRating(ratingId, memberId);
        ratingRepository.delete(rating);
    }

    private Rating findOwnedRating(Long ratingId, Long memberId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RATING_NOT_FOUND));

        if (!rating.getMember().getMemberId().equals(memberId)) {
            throw new BusinessException(ErrorCode.RATING_FORBIDDEN);
        }

        return rating;
    }
}
