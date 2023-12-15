package com.phoenix.services;

import com.phoenix.config.KeycloakSecurityUtil;
import com.phoenix.mapper.IMapper;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServices implements IUserServices {
    @Autowired
    KeycloakSecurityUtil keycloakUtil;

    @Autowired
    IMapper iMapper;
    @Value("${realm}")
    private String realm;
    @Override
    public void assignRoles(String userId, List<String> realmRoles) {
        Keycloak keycloak = keycloakUtil.getKeycloakInstance();

        // Convert role names to RoleRepresentation objects
        List<RoleRepresentation> roleReps = realmRoles.stream()
                .map(roleName -> keycloak.realm(realm).roles().get(roleName).toRepresentation())
                .collect(Collectors.toList());

        // Add roles to the user
        keycloak.realm(realm).users().get(userId).roles().realmLevel().add(roleReps);
    }


}
