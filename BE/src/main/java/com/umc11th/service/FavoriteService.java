package com.umc11th.service;

import com.umc11th.dto.CreateFavoriteRequest;
import com.umc11th.dto.FavoriteResponse;
import com.umc11th.dto.FavoriteStatusResponse;
import com.umc11th.entity.Favorite;
import com.umc11th.entity.Member;
import com.umc11th.exception.ApiException;
import com.umc11th.repository.FavoriteRepository;
import com.umc11th.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public FavoriteResponse create(Long memberId, CreateFavoriteRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."
                ));

        if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new ApiException(
                    HttpStatus.CONFLICT,
                    "FAVORITE409_1",
                    "이미 이 영화를 즐겨찾기하셨습니다."
            );
        }

        Favorite favorite = Favorite.builder()
                .member(member)
                .movieId(request.movieId())
                .build();

        return FavoriteResponse.from(favoriteRepository.save(favorite));
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> getMyFavorites(Long memberId) {
        return favoriteRepository.findByMember_MemberIdOrderByFavoriteIdDesc(memberId).stream()
                .map(FavoriteResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public FavoriteStatusResponse getStatus(Long memberId, Long movieId) {
        boolean favorite = favoriteRepository
                .existsByMember_MemberIdAndMovieId(memberId, movieId);
        return new FavoriteStatusResponse(favorite);
    }

    @Transactional
    public void delete(Long memberId, Long movieId) {
        Favorite favorite = favoriteRepository
                .findByMember_MemberIdAndMovieId(memberId, movieId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "FAVORITE404_1",
                        "즐겨찾기한 영화를 찾을 수 없습니다."
                ));

        favoriteRepository.delete(favorite);
    }
}
