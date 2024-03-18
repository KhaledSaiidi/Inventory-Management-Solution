package com.phoenix.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
@Service
@RequiredArgsConstructor
public class KeycloakTokenFetcher {

    @Autowired
    private final RestTemplate restTemplate;

    public String getToken() {
        String tokenUrl = "http://localhost:8181/realms/phoenixstock/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
        body.add("grant_type", "password");
        body.add("client_id", "front-client");
        body.add("username", "admin");
        body.add("password", "admin");

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<TokenResponse> responseEntity = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                requestEntity,
                TokenResponse.class
        );
        if (responseEntity.getStatusCode().is2xxSuccessful()) {
            TokenResponse tokenResponse = responseEntity.getBody();

            return tokenResponse.access_token;
        } else {
            return null;
        }
    }

    static class TokenResponse {
        private String access_token;

        public String getAccess_token() {
            return access_token;
        }


    }
}
