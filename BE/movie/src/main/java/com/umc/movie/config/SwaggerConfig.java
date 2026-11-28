package com.umc.movie.config;

import com.umc.movie.auth.LoginMember;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.examples.Example;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Content;
import io.swagger.v3.oas.models.media.MediaType;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OperationCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class SwaggerConfig {
    private static final String BEARER_AUTH = "bearerAuth";

    @Bean
    OpenAPI movieOpenAPI() {
        return new OpenAPI()
                .info(new Info().title("영화 평점 서비스 API")
                        .description("UMC 9주차 회원, 평점, 즐겨찾기, 영화 기록 API")
                        .version("v1"))
                .components(new Components().addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")));
    }

    @Bean
    OperationCustomizer documentLoginMember() {
        return (operation, handler) -> {
            boolean requiresToken = Arrays.stream(handler.getMethodParameters())
                    .anyMatch(parameter -> parameter.hasParameterAnnotation(LoginMember.class));
            if (requiresToken) {
                operation.addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH));
                operation.getResponses().addApiResponse("401", new io.swagger.v3.oas.models.responses.ApiResponse()
                        .description("AUTH401_2 로그인 필요 · AUTH401_3 유효하지 않은 토큰 · AUTH401_4 만료된 토큰")
                        .content(new Content().addMediaType("application/json", new MediaType()
                                .addExamples("AUTH401_2", errorExample(
                                        "AUTH401_2", "로그인이 필요한 요청입니다."))
                                .addExamples("AUTH401_3", errorExample(
                                        "AUTH401_3", "유효하지 않은 토큰입니다."))
                                .addExamples("AUTH401_4", errorExample(
                                        "AUTH401_4", "토큰이 만료되었습니다. 다시 로그인해주세요.")))));
            }
            return operation;
        };
    }

    private Example errorExample(String code, String message) {
        return new Example().value(JsonNodeFactory.instance.objectNode()
                .put("isSuccess", false).put("code", code).put("message", message).putNull("result"));
    }
}
