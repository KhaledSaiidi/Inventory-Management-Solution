package com.phoenix.config;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationUtils {
    public static String addAuthorizationHeader() {
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            Jwt jwt = authentication.getToken();
            if (jwt != null) {
                System.out.println("jwt is :" + jwt);
                String token = jwt.getTokenValue();
                System.out.println("Token is : " + token);
                return token;
            }
        }
        return null;
    }
}
