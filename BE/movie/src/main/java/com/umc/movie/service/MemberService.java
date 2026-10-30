package com.umc.movie.service;
import com.umc.movie.dto.AvailabilityResponse;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {
    private final MemberRepository memberRepository;
    public AvailabilityResponse checkNickname(String nickname) {
        return new AvailabilityResponse(!memberRepository.existsByNickname(nickname));
    }
    public AvailabilityResponse checkEmail(String email) {
        return new AvailabilityResponse(!memberRepository.existsByEmail(email));
    }
}
