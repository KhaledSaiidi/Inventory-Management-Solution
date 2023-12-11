package com.Sofrecom.apigateway.config;

import com.Sofrecom.apigateway.utils.TokenUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.SecurityWebFiltersOrder;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoders;


import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
private final TokenUtils tokenUtils;

    public SecurityConfig(TokenUtils tokenUtils) {
        this.tokenUtils = tokenUtils;
    }

    @Bean
    public ReactiveJwtDecoder reactiveJwtDecoder() {
        return ReactiveJwtDecoders.fromIssuerLocation("http://localhost:8181/realms/SofManagers");
    }

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity serverHttpSecurity) {
        serverHttpSecurity
                .csrf().disable()
                .cors().configurationSource(corsConfigurationSource())
                .and()
                .authorizeExchange(exchange ->
                        exchange.pathMatchers("/eureka/**")
                                .permitAll()
                                .anyExchange()
                                .authenticated())
                .oauth2ResourceServer(ServerHttpSecurity.OAuth2ResourceServerSpec::jwt)
                .addFilterAfter(new UserHeaderFilter(tokenUtils), SecurityWebFiltersOrder.AUTHENTICATION);
        return serverHttpSecurity.build();
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
