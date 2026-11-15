package com.umc.movie.service;

import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class FavoriteService {
  private final FavoriteRepository favoriteRepository;
  private final MemberRepository memberRepository;

  @Transactional
  public FavoriteResponse create(Long memberId, CreateFavoriteRequest request) {
    Member member =
        memberRepository
            .findById(memberId)
            .orElseThrow(() -> new ApiException(404, "MEMBER404_1", "해당 회원을 찾을 수 없습니다."));

    // 친절한 오류 메시지를 위한 사전 검사. 동시 요청은 DB UNIQUE 제약이 마지막으로 막습니다.
    if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
      throw new ApiException(409, "FAVORITE409_1", "이미 이 영화를 즐겨찾기하셨습니다.");
    }

    Favorite favorite = new Favorite(member, request.movieId());
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
    return new FavoriteStatusResponse(
        favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, movieId));
  }

  @Transactional
  public void delete(Long memberId, Long movieId) {
    Favorite favorite =
        favoriteRepository
            .findByMember_MemberIdAndMovieId(memberId, movieId)
            .orElseThrow(
                () -> new ApiException(404, "FAVORITE404_1", "즐겨찾기한 영화를 찾을 수 없습니다."));
    favoriteRepository.delete(favorite);
  }
}
