package com.devcoders.dlvery.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class OpenApiConfigTest {

    @Autowired
    private OpenApiConfig openApiConfig;

    @Test
    @DisplayName("Test OpenAPI bean creation")
    void testOpenAPIBeanCreation() {
        // When
        OpenAPI openAPI = openApiConfig.dlVeryOpenAPI();

        // Then
        assertThat(openAPI).isNotNull();
    }

    @Test
    @DisplayName("Test OpenAPI info configuration")
    void testOpenAPIInfoConfiguration() {
        // When
        OpenAPI openAPI = openApiConfig.dlVeryOpenAPI();
        Info info = openAPI.getInfo();

        // Then
        assertThat(info).isNotNull();
        assertThat(info.getTitle()).isEqualTo("DlVery API");
        assertThat(info.getDescription()).contains("Delivery Management System API Documentation");
        assertThat(info.getVersion()).isEqualTo("1.0.0");
    }

    @Test
    @DisplayName("Test OpenAPI contact information")
    void testOpenAPIContactInformation() {
        // When
        OpenAPI openAPI = openApiConfig.dlVeryOpenAPI();
        Contact contact = openAPI.getInfo().getContact();

        // Then
        assertThat(contact).isNotNull();
        assertThat(contact.getName()).isEqualTo("DevCoders Team");
        assertThat(contact.getEmail()).isEqualTo("support@devcoders.com");
        assertThat(contact.getUrl()).isEqualTo("https://devcoders.com");
    }

    @Test
    @DisplayName("Test OpenAPI license information")
    void testOpenAPILicenseInformation() {
        // When
        OpenAPI openAPI = openApiConfig.dlVeryOpenAPI();
        License license = openAPI.getInfo().getLicense();

        // Then
        assertThat(license).isNotNull();
        assertThat(license.getName()).isEqualTo("Apache 2.0");
        assertThat(license.getUrl()).isEqualTo("https://www.apache.org/licenses/LICENSE-2.0.html");
    }

    @Test
    @DisplayName("Test OpenAPI security scheme configuration")
    void testOpenAPISecuritySchemeConfiguration() {
        // When
        OpenAPI openAPI = openApiConfig.dlVeryOpenAPI();
        SecurityScheme securityScheme = openAPI.getComponents().getSecuritySchemes().get("Bearer Authentication");

        // Then
        assertThat(securityScheme).isNotNull();
        assertThat(securityScheme.getType()).isEqualTo(SecurityScheme.Type.HTTP);
        assertThat(securityScheme.getScheme()).isEqualTo("bearer");
        assertThat(securityScheme.getBearerFormat()).isEqualTo("JWT");
        assertThat(securityScheme.getName()).isEqualTo("Bearer Authentication");
    }

    @Test
    @DisplayName("Test OpenAPI security requirement configuration")
    void testOpenAPISecurityRequirementConfiguration() {
        // When
        OpenAPI openAPI = openApiConfig.dlVeryOpenAPI();
        SecurityRequirement securityRequirement = openAPI.getSecurity().get(0);

        // Then
        assertThat(securityRequirement).isNotNull();
        assertThat(securityRequirement.get("Bearer Authentication")).isNotNull();
    }
}