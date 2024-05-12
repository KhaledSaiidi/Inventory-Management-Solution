package com.phoenix.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;

import java.net.http.WebSocket;
import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity serverHttpSecurity) {
        serverHttpSecurity
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(exchange ->
                        exchange.pathMatchers("/eureka/**", "/notification/notif-websocket/**")
                                .permitAll()
                                .anyExchange()
                                .authenticated())
                .oauth2ResourceServer(spec -> spec.jwt(Customizer.withDefaults()));
        return serverHttpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return exchange -> {
            ServerHttpResponse response = exchange.getResponse();
            HttpHeaders headers = response.getHeaders();
            String path = exchange.getRequest().getURI().getPath();
            if (!path.startsWith("/notification/notif-websocket/")) {
                String origin = exchange.getRequest().getHeaders().getOrigin();
                /*
                 if (origin.equals("http://localhost:4200")) {
                    headers.setAccessControlAllowOrigin("http://localhost:4200");
                } else if (origin.equals("http://localhost:8100")) {
                    headers.setAccessControlAllowOrigin("http://localhost:8100");
                } else {
                    return null;
                }
                 */
                headers.setAccessControlAllowOrigin(origin);
                headers.setAccessControlAllowCredentials(true);
                headers.setAccessControlAllowHeaders(Arrays.asList("Authorization", "Content-Type"));

                if (exchange.getRequest().getMethod() == HttpMethod.OPTIONS) {
                    headers.setAccessControlAllowMethods(Arrays.asList(
                            HttpMethod.GET,
                            HttpMethod.POST,
                            HttpMethod.PUT,
                            HttpMethod.DELETE
                    ));
                    headers.setAccessControlMaxAge(3600L);
                    return new CorsConfiguration().applyPermitDefaultValues();
                }
            }
            return null;
        };
    }
}