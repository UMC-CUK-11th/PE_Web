package com.umc.movie.config;

import com.umc.movie.dto.ApiResponse;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    public static final String BEARER_AUTH = "bearerAuth";
    public static final String UNAUTHORIZED = "#/components/responses/Unauthorized";

    @Bean
    public OpenAPI movieApi() {
        Components components = new Components()
                .addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT"))
                .addResponses("Unauthorized", new io.swagger.v3.oas.models.responses.ApiResponse()
                        .description("AUTH401_2 토큰 누락 또는 Bearer 형식 오류 / AUTH401_3 잘못된 토큰 / AUTH401_4 만료된 토큰")
                        .content(new Content().addMediaType("application/json", new MediaType()
                                .example(ApiResponse.failure("AUTH401_2", "로그인이 필요한 요청입니다.")))));
        return new OpenAPI()
                .info(new Info().title("Movie API")
                        .description("자물쇠가 표시된 API는 POST /auth/login에서 발급받은 JWT가 필요함."))
                .components(components);
    }
}
