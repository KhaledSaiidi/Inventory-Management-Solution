package com.phoenix.mapper;

import com.phoenix.dto.User;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;

public interface IMapper {
    List<User> mapUsers(List<UserRepresentation> userRepresentations);
    User mapUser(UserRepresentation userRep);
    UserRepresentation mapUserRep(User user);
}
