package com.umc.study.dto;

import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class CreateBookRequestValidationTest {

    private static Validator validator;

    @BeforeAll
    static void setUpValidator() {
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void rejectsMissingCategoryAndBlankTitle() {
        CreateBookRequest request = new CreateBookRequest(null, " ", null);

        assertThat(validator.validate(request))
                .extracting(violation -> violation.getPropertyPath().toString())
                .containsExactlyInAnyOrder("categoryId", "title");
    }

    @Test
    void rejectsTitleLongerThanOneHundredCharacters() {
        CreateBookRequest request = new CreateBookRequest(1L, "가".repeat(101), null);

        assertThat(validator.validate(request))
                .extracting(violation -> violation.getPropertyPath().toString())
                .containsExactly("title");
    }
}
