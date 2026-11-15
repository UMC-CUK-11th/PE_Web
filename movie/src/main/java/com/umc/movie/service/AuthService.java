package com.umc.movie.service;

import com.umc.movie.dto.auth.LoginRequest;
import com.umc.movie.dto.auth.LoginResponse;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // [1]
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public LoginResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.email()) // [2]
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_1",
                        "이메일 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.password(), member.getPassword())) { // [3]
            throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_1",
                    "이메일 또는 비밀번호가 올바르지 않습니다.");
        }

        String accessToken = jwtUtil.createAccessToken(member.getMemberId(), member.getEmail()); // [4]

        return new LoginResponse(member.getNickname(), accessToken); // [5]
    }
}

/*
 * [1] Bean을 생성자로 주입받기
 * @Service로 이 클래스를 Bean으로 등록한다. Lombok은 final 필드를 받는 생성자를 만들어준다.
 * Spring이 그 생성자에 MemberRepository, PasswordEncoder, JwtUtil Bean을 전달한다.
 * 생성자 내부에서는 this.passwordEncoder = passwordEncoder;처럼 전달받은 객체를 필드에 저장한다.
 * PasswordConfig.passwordEncoder()는 객체를 만드는 메서드이고, 여기의 passwordEncoder는 그 반환 객체를 가리키는 필드다.
 * 필드에 설정 클래스나 생성 메서드가 들어가는 것이 아니라 실제 BCryptPasswordEncoder 객체가 연결된다.
 * PasswordEncoder는 인터페이스이고 BCryptPasswordEncoder는 이를 구현한 클래스라 이 타입으로 받을 수 있다.
 *
 * [2] 요청 이메일로 회원 조회 → 없으면 예외
 * request는 컨트롤러가 전달한 LoginRequest이고 email()로 이메일을 꺼낸다.
 * findByEmail은 파생 쿼리로 회원을 조회하고 Optional<Member>를 반환한다.
 * orElseThrow는 레포지토리가 아니라 Java Optional의 메서드다.
 * 앞의 조회가 실행되지 않았다는 뜻이 아니라, 정상 조회 결과에 회원이 없을 때 예외를 던진다.
 * 회원이 있으면 Member를 꺼내 member에 저장한다. 없으면 람다 () -> ...를 실행해 예외를 만든다.
 * if (result.isEmpty()) { throw ...; } 다음 Member member = result.get();을 쓰는 흐름과 같다.
 * try-catch는 예외를 잡는 것이고, orElseThrow는 값이 없을 때 예외를 발생시키는 것이다.
 * 가입 여부를 응답으로 드러내지 않도록 이메일 없음과 비밀번호 불일치에 같은 상태·코드·메시지를 사용한다.
 *
 * [3] 평문 비밀번호와 DB의 해시 비교
 * PasswordEncoder 인터페이스에도 matches가 선언돼 있고, 실제 주입된 BCryptPasswordEncoder의 구현이 실행된다.
 * 첫 인자는 DTO에서 꺼낸 평문, 둘째 인자는 회원 엔티티에서 꺼낸 저장된 비밀번호 해시다.
 * matches가 저장된 해시의 salt·비용 설정으로 입력값을 계산해 비교하므로 encode를 먼저 호출하지 않는다.
 * 일치하면 true, 다르면 false다. !로 뒤집어 불일치할 때 401·AUTH401_1 예외를 던진다.
 *
 * [4] 회원 확인을 통과한 뒤 토큰 발급
 * @Component로 등록한 JwtUtil Bean을 주입받아 createAccessToken을 호출한다.
 * DB에서 찾은 회원 ID·이메일을 전달하면 JwtUtil이 시간 정보와 서명을 포함한 JWT String을 반환한다.
 *
 * [5] 닉네임과 토큰을 LoginResponse에 담아 컨트롤러에 반환한다.
 * 전체 흐름: 요청 DTO → 이메일로 회원 조회 → 비밀번호 비교 → 토큰 생성 → 응답 DTO.
 * 회원 조회나 비밀번호 확인에서 예외가 발생하면 이후 토큰 생성·정상 반환으로 진행하지 않는다.
 */
