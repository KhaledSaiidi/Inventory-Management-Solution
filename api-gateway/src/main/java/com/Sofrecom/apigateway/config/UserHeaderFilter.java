package com.Sofrecom.apigateway.config;

import com.Sofrecom.apigateway.utils.TokenUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

public class UserHeaderFilter implements WebFilter {
    private final TokenUtils tokenUtils;

    public UserHeaderFilter(TokenUtils tokenUtils) {
        this.tokenUtils = tokenUtils;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        return tokenUtils.getUserHeaders()
                .flatMap(headers -> {
                    ServerHttpRequest request = exchange.getRequest().mutate().headers(httpHeaders -> httpHeaders.addAll(headers)).build();
                    return chain.filter(exchange.mutate().request(request).build());
                });
    }
}
