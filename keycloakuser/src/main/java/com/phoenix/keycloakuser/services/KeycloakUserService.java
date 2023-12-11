package com.phoenix.keycloakuser.services;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class KeycloakUserService {

    @Autowired
    private Keycloak keycloak;

    public void registerUser(String username, String password, String roleName) {
        RealmResource realmResource = keycloak.realm("phoenixstock");
        UsersResource usersResource = realmResource.users();

        // Create User
        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEnabled(true);
        user.setCredentials(Collections.singletonList(getPasswordCredentials(password)));

        usersResource.create(user);

        // Assign Role to User
        RoleRepresentation role = realmResource.roles().get(roleName).toRepresentation();
        usersResource.get(username).roles().realmLevel().add(Collections.singletonList(role));
    }

    private CredentialRepresentation getPasswordCredentials(String password) {
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(true); // Set password as temporary
        return credential;
    }
}
