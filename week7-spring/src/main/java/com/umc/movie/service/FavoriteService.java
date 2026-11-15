
package com.umc.movie.service;

import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
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

    // 즐겨찾기 등록
    @Transactional
    public FavoriteResponse create(Long memberId, CreateFavoriteRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new ApiException(
                        HttpStatus.NOT_FOUND,
                        "MEMBER404_1",
                        "해당 회원을 찾을 수 없습니다."
                ));

        // 동일 회원의 중복 즐겨찾기 방지
        if (favoriteRepository.existsByMember_MemberIdAndMovieId(
                memberId, request.movieId())) {
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

    // 내 즐겨찾기 목록 조회 (최신 등록순)
    @Transactional(readOnly = true)
    public List<FavoriteResponse> getMyFavorites(Long memberId) {
        return favoriteRepository
                .findByMember_MemberIdOrderByFavoriteIdDesc(memberId)
                .stream()
                .map(FavoriteResponse::from)
                .toList();
    }

    // 특정 영화의 즐겨찾기 여부 조회
    @Transactional(readOnly = true)
    public FavoriteStatusResponse getStatus(Long memberId, Long movieId) {
        boolean isFavorite =
                favoriteRepository.existsByMember_MemberIdAndMovieId(
                        memberId, movieId
                );

        return new FavoriteStatusResponse(isFavorite);
    }

    // 즐겨찾기 해제
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
