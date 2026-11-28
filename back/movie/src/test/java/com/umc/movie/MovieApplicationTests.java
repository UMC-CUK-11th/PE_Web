package com.umc.movie;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class MovieApplicationTests {
    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper json;

    @Test
    void swaggerDocumentsRatingMemberAndFavoriteOperations() throws Exception {
        mvc.perform(get("/swagger-ui.html")).andExpect(status().is3xxRedirection());
        mvc.perform(get("/swagger-ui/index.html")).andExpect(status().isOk());
        mvc.perform(get("/v3/api-docs/swagger-config")).andExpect(status().isOk());
        JsonNode document = json.readTree(mvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsByteArray());
        JsonNode paths = document.path("paths");

        JsonNode memberRatings = paths.path("/members/{memberId}/ratings").path("get");
        assertThat(memberRatings.path("description").asText()).isNotBlank();
        assertThat(memberRatings.path("security").isEmpty()).isTrue();
        assertErrorCode(memberRatings, "404", "MEMBER404_1");

        Map<String, String> securedOperations = Map.of(
                "post /ratings", "201",
                "patch /ratings/{ratingId}", "200",
                "delete /ratings/{ratingId}", "200",
                "get /members/me", "200",
                "patch /members/me", "200",
                "get /favorites", "200",
                "get /favorites/{movieId}", "200",
                "delete /favorites/{movieId}", "200"
        );
        securedOperations.forEach((route, successCode) -> {
            String[] endpoint = route.split(" ", 2);
            JsonNode operation = paths.path(endpoint[1]).path(endpoint[0]);
            assertThat(operation.path("description").asText()).as(route).isNotBlank();
            assertThat(operation.path("security").path(0).has("bearerAuth")).as(route).isTrue();
            assertThat(operation.path("responses").has(successCode)).as(route).isTrue();
            assertThat(operation.path("responses").path("401").path("$ref").asText()).as(route)
                    .isEqualTo("#/components/responses/Unauthorized");
        });
        assertThat(document.at("/components/responses/Unauthorized/description").asText())
                .contains("AUTH401_2", "AUTH401_3", "AUTH401_4");
        assertErrorCode(paths.path("/ratings").path("post"), "409", "RATING409_1");
        assertErrorCode(paths.path("/ratings/{ratingId}").path("patch"), "403", "RATING403_1");
        assertErrorCode(paths.path("/ratings/{ratingId}").path("delete"), "404", "RATING404_1");
        assertErrorCode(paths.path("/members/me").path("patch"), "409", "MEMBER409_1");
        assertErrorCode(paths.path("/favorites/{movieId}").path("delete"), "404", "FAVORITE404_1");
    }

    private static void assertErrorCode(JsonNode operation, String status, String code) {
        assertThat(operation.path("responses").path(status).path("description").asText()).contains(code);
    }
}
