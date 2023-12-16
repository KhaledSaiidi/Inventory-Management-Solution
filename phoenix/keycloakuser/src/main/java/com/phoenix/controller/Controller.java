package com.phoenix.controller;

import com.phoenix.config.KeycloakSecurityUtil;
import com.phoenix.dto.UserMysqldto;
import com.phoenix.dto.Userdto;
import com.phoenix.mapper.IMapper;
import com.phoenix.services.IUserServices;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.core.Response;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/people")
@CrossOrigin("*")
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
    public List<Userdto> getUsers() {
        Keycloak keycloak = keycloakUtil.getKeycloakInstance();
        List<UserRepresentation> userRepresentations =
                keycloak.realm(realm).users().list();
        userRepresentations = userRepresentations.stream()
                .filter(userRep -> !userRep.getUsername().equals("admin"))
                .collect(Collectors.toList());
        return iMapper.mapUsers(userRepresentations);
    }

    @PostMapping
    @RequestMapping("/adduserdto")
    public Response createUser(@RequestBody Userdto userdto) {
        List<String> realmRoles = userdto.getRealmRoles();
        UserRepresentation userRep = iMapper.mapUserRep(userdto);
        Keycloak keycloak = keycloakUtil.getKeycloakInstance();
        keycloak.realm(realm).users().create(userRep);
        iUserServices.addUser(userdto);
        // Assign realm roles to the created userdto
        String userId = keycloak.realm(realm).users().search(userdto.getUserName()).get(0).getId();
        iUserServices.assignRoles(userId, userdto.getRealmRoles());

        return Response.ok(userdto).build();
    }

    @GetMapping("userdetails/{username}")
    public ResponseEntity<UserMysqldto> getUserByUsername(@PathVariable String username) {
        UserMysqldto userDto = iUserServices.getUserByUsername(username);

        if (userDto != null) {
            return new ResponseEntity<>(userDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }




}
