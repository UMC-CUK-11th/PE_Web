package com.umc.movie.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    // 각 API에 자물쇠를 연결할 때 쓰는 이름표 (실습 3에서 씀)
    public static final String BEARER_AUTH = "bearerAuth";

    @Bean
    public OpenAPI movieOpenAPI() {
        return new OpenAPI()
                // 문서 표지: Swagger 화면 맨 위에 뜨는 제목, 설명, 버전
                .info(new Info()
                        .title("영화 평점 서비스 API")
                        .description("UMC 11기 백엔드 워크북에서 만든 회원/평점/즐겨찾기 API 문서입니다.")
                        .version("v1"))
                // 인증 방식 등록: "Authorization: Bearer 토큰" 방식을 쓴다고 선언 → Authorize 버튼이 생김
                .components(new Components()
                        .addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
