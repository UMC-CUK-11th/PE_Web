package com.umc.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SwaggerApiIntegrationTests {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    @Test
    @DisplayName("토큰 없이 Swagger UI와 생성된 OpenAPI 문서를 열 수 있다")
    void swaggerRoutesArePublic() throws Exception {
        mvc.perform(get("/swagger-ui.html")).andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/swagger-ui/index.html"));
        mvc.perform(get("/swagger-ui/index.html")).andExpect(status().isOk());
        mvc.perform(get("/v3/api-docs/swagger-config")).andExpect(status().isOk())
                .andExpect(jsonPath("$.url").value("/v3/api-docs"));
        mvc.perform(get("/v3/api-docs.yaml")).andExpect(status().isOk());
    }

    @Test
    @DisplayName("15개 API를 생성하고 공개 API와 Bearer 토큰이 필요한 API를 구분한다")
    void documentsPublicAndAuthenticatedOperations() throws Exception {
        byte[] body = mvc.perform(get("/v3/api-docs")).andExpect(status().isOk())
                .andReturn().getResponse().getContentAsByteArray();
        JsonNode document = json.readTree(body);
        assertThat(document.at("/components/securitySchemes/bearerAuth/scheme").asText()).isEqualTo("bearer");

        JsonNode paths = document.path("paths");
        Map<String, Set<String>> authenticated = Map.of(
                "/members/me", Set.of("get", "patch"),
                "/ratings", Set.of("post"),
                "/ratings/{ratingId}", Set.of("patch", "delete"),
                "/favorites", Set.of("get", "post"),
                "/favorites/{movieId}", Set.of("get", "delete"),
                "/movie-records", Set.of("post"));
        Map<String, Set<String>> publicOperations = Map.of(
                "/auth/login", Set.of("post"),
                "/members", Set.of("post"),
                "/members/nickname/{nickname}", Set.of("get"),
                "/members/email/{email}", Set.of("get"),
                "/members/{memberId}/ratings", Set.of("get"));

        assertThat(paths.size()).isEqualTo(authenticated.size() + publicOperations.size());
        authenticated.forEach((path, methods) -> {
            assertThat(paths.path(path).size()).isEqualTo(methods.size());
            methods.forEach(method -> {
                JsonNode operation = paths.path(path).path(method);
                assertThat(operation.path("summary").asText()).isNotBlank();
                assertThat(operation.at("/security/0/bearerAuth").isArray()).isTrue();
                assertThat(operation.at("/responses/401/description").asText()).contains("AUTH401_2", "AUTH401_3", "AUTH401_4");
                assertThat(operation.path("parameters").findValuesAsText("name")).doesNotContain("memberId");
            });
        });
        publicOperations.forEach((path, methods) -> {
            assertThat(paths.path(path).size()).isEqualTo(methods.size());
            methods.forEach(method -> {
                JsonNode operation = paths.path(path).path(method);
                assertThat(operation.path("summary").asText()).isNotBlank();
                assertThat(operation.path("security").isEmpty()).isTrue();
            });
        });
        assertThat(paths.path("/members/{memberId}/ratings").path("get").at("/parameters/0/name").asText())
                .isEqualTo("memberId");
        assertThat(paths.path("/ratings").path("post").at("/responses/409/description").asText())
                .contains("RATING409_1");
        assertThat(paths.path("/ratings/{ratingId}").path("patch").at("/responses/403/description").asText())
                .contains("RATING403_1");
        JsonNode createFavorite = paths.path("/favorites").path("post");
        assertThat(createFavorite.at("/responses/201/content/application~1json/example/code").asText())
                .isEqualTo("COMMON201");
        assertThat(createFavorite.at("/responses/401/content/application~1json/examples/AUTH401_2/value/result").isNull())
                .isTrue();
        assertThat(createFavorite.at("/responses/409/content/application~1json/example/code").asText())
                .isEqualTo("FAVORITE409_1");
    }
}
