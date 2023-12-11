package com.Sofrecom.apigateway.utils;

import com.Sofrecom.apigateway.UserandNotificationdto.UserInfo;
import com.nimbusds.jose.shaded.json.JSONArray;
import com.nimbusds.jose.shaded.json.JSONObject;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class TokenUtils {

    private String getRoleFromJwt(Jwt jwt) {
        JSONObject realmAccess = jwt.getClaim("realm_access");
        JSONArray roles = (JSONArray) realmAccess.get("roles");
        List<String> roleList = roles.stream().map(Object::toString).collect(Collectors.toList());
        if (roleList.contains("ADMIN") && roleList.contains("USER")) {
            return "ADMIN";
        } else if (roleList.contains("ADMIN")) {
            return "ADMIN";
        } else {
            return "USER";
        }
    }

    public Mono<UserInfo> getUserInfo() {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .map(Authentication::getPrincipal)
                .map(Jwt.class::cast)
                .map(jwt -> {
                    String name = jwt.getClaimAsString("name");
                    String email = jwt.getClaimAsString("email");
                    String role = getRoleFromJwt(jwt);
                    return new UserInfo(name, email, role);
                });
    }
    public Mono<HttpHeaders> getUserHeaders() {
        return ReactiveSecurityContextHolder.getContext()
                .map(SecurityContext::getAuthentication)
                .map(Authentication::getPrincipal)
                .map(Jwt.class::cast)
                .map(jwt -> {
                    String name = jwt.getClaimAsString("name");
                    String email = jwt.getClaimAsString("email");
                    String role = getRoleFromJwt(jwt);

                    HttpHeaders headers = new HttpHeaders();
                    headers.add("X-User-Name", name);
                    headers.add("X-User-Email", email);
                    headers.add("X-User-Role", role);

                    return headers;
                });
    }


}
