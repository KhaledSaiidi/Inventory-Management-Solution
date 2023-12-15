package com.phoenix.mapper;

import com.phoenix.dto.User;
import org.keycloak.common.util.CollectionUtil;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserMapper implements IMapper {
    @Override
    public List<User> mapUsers(List<UserRepresentation> userRepresentations){
        List<User> users = new ArrayList<>();
        if (CollectionUtil.isNotEmpty(userRepresentations)){
            userRepresentations.forEach(userRep -> {
                users.add(mapUser(userRep));
            });
        }
        return users;
    }
    @Override
    public User mapUser(UserRepresentation userRep){
        User user = new User();
        user.setFirstName(userRep.getFirstName());
        user.setLastName(userRep.getLastName());
        user.setEmail(userRep.getEmail());
        user.setUserName(userRep.getUsername());
        return user;
    }

    @Override
    public UserRepresentation mapUserRep(User user){

        UserRepresentation userRep = new UserRepresentation();
        userRep.setUsername(user.getUserName());
        userRep.setFirstName(user.getFirstName());
        userRep.setLastName(user.getLastName());
        userRep.setEmail(user.getEmail());
        userRep.setEnabled(true);
        userRep.setEmailVerified(false);
        List<CredentialRepresentation> creds = new ArrayList<>();
        CredentialRepresentation cred = new CredentialRepresentation();
        cred.setTemporary(true);
        cred.setValue(user.getPassword());
        creds.add(cred);
        userRep.setCredentials(creds);
        System.out.println("Mapped User: " + userRep.toString());
        return userRep;
    }

}
