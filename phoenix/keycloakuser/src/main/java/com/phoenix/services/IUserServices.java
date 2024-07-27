package com.phoenix.services;

import com.phoenix.dto.UserMysqldto;
import com.phoenix.dto.Userdto;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;
import java.util.Map;

public interface IUserServices {
    void assignRoles(String userId, List<String> realmRoles);
    Userdto addUser(Userdto userDto);
    UserMysqldto getUserByUsername(String username);
    List<Userdto> getallUsers();
    Userdto UpdateUser(String userId, Userdto userDto);
    void DeleteUser(String userId);
    Map<String, String> getUsernameByFirstAndLastName();

}
