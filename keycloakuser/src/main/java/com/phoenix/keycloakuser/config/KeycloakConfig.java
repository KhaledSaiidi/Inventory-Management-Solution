package com.phoenix.keycloakuser.config;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class KeycloakConfig {

    @Bean
    public Keycloak keycloak() {
        return KeycloakBuilder.builder()
                .serverUrl("http://localhost:8181/auth")
                .realm("phoenixstock")
                .clientId("front-client")
                .grantType("password")
                .username("admin") // Replace with your admin username
                .password("admin") // Replace with your admin password
                .build();
    }

    public CorsConfigurationSource corsConfigurationSource() {
        return exchange -> {
            ServerHttpRequest request = exchange.getRequest();
            ServerHttpResponse response = exchange.getResponse();
            HttpHeaders headers = response.getHeaders();

            // Allow requests from a specific origin
            headers.setAccessControlAllowOrigin("*");
            headers.setAccessControlAllowCredentials(true);
            headers.setAccessControlAllowHeaders(Arrays.asList("Authorization", "Content-Type")); // Add "Content-Type" header

            if (request.getMethod() == HttpMethod.OPTIONS) {
                headers.setAccessControlAllowMethods(Arrays.asList(
                        HttpMethod.GET,
                        HttpMethod.POST,
                        HttpMethod.PUT,
                        HttpMethod.DELETE
                ));
                headers.setAccessControlMaxAge(3600L);
                return new CorsConfiguration().applyPermitDefaultValues();
            }

            return new CorsConfiguration();
        };
    }
}

