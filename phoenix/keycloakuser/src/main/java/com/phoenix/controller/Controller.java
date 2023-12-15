package com.phoenix.controller;

import com.phoenix.config.KeycloakSecurityUtil;
import com.phoenix.dto.User;
import com.phoenix.mapper.IMapper;
import com.phoenix.mapper.UserMapper;
import com.phoenix.services.IUserServices;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.common.util.CollectionUtil;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class Controller {
    @Autowired
    KeycloakSecurityUtil keycloakUtil;
    @Autowired
    IMapper iMapper;
    @Autowired
    IUserServices iUserServices;


    @Value("${realm}")
    private String realm;

    @GetMapping
    @RequestMapping("/users")
    public List<User> getUsers() {
        Keycloak keycloak = keycloakUtil.getKeycloakInstance();
        List<UserRepresentation> userRepresentations =
                keycloak.realm(realm).users().list();
        userRepresentations = userRepresentations.stream()
                .filter(userRep -> !userRep.getUsername().equals("admin"))
                .collect(Collectors.toList());
        return iMapper.mapUsers(userRepresentations);
    }

    @PostMapping
    @RequestMapping("/user")
    public Response createUser(@RequestBody User user) {
        List<String> realmRoles = user.getRealmRoles();
        UserRepresentation userRep = iMapper.mapUserRep(user);
        Keycloak keycloak = keycloakUtil.getKeycloakInstance();
        keycloak.realm(realm).users().create(userRep);

        // Assign realm roles to the created user
        String userId = keycloak.realm(realm).users().search(user.getUserName()).get(0).getId();
        iUserServices.assignRoles(userId, user.getRealmRoles());

        return Response.ok(user).build();
    }



}
