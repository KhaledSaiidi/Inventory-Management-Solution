package com.phoenix.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.reactive.function.client.ClientRequest;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Configuration
public class WebClientConfig {
    @Bean
    @LoadBalanced
    public WebClient.Builder webClientBuilder(AuthorizationUtils authorizationUtils){
        return WebClient.builder()
                .filter(ExchangeFilterFunction.ofRequestProcessor(
                        clientRequest -> {
                            String token = authorizationUtils.addAuthorizationHeader();
                            if (token != null) {
                                return Mono.just(ClientRequest.from(clientRequest)
                                        .headers(headers -> headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + token))
                                        .build());
                            }
                            return Mono.just(clientRequest);
                        }));
    }

}
