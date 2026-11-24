package com.umc.movie.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    public static final String BEARER_AUTH = "bearerAuth";

    @Bean // [1]
    public OpenAPI movieOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("영화 평점 서비스 API")
                        .description("UMC 11기 백엔드 워크북에서 만든 회원/평점/즐겨찾기 API 문서입니다.")
                        .version("v1"))
                .components(new Components()
                        .addSecuritySchemes(BEARER_AUTH, new SecurityScheme() // [2]
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}

// [1] Spring에 OpenAPI 설정 객체를 등록하면 springdoc이 문서 제목, 설명, 버전을 반영한다.
// [2] bearerAuth를 참조하는 API는 Swagger UI가 Authorization: Bearer 토큰 헤더를 붙인다.
