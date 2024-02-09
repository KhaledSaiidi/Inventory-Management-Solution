package com.phoenix.mapper;

import com.phoenix.dto.UserMysqldto;
import com.phoenix.dto.Userdto;
import com.phoenix.model.UserMysql;
import org.keycloak.representations.idm.UserRepresentation;

import java.util.List;

public interface IMapper {
    List<Userdto> mapUsers(List<UserRepresentation> userRepresentations);
    Userdto mapUser(UserRepresentation userRep);
    UserRepresentation mapUserRep(Userdto userdto);
    UserRepresentation mapUserRepForUpdate(Userdto userdto);
    Userdto mapUserMysqlToDto(UserMysql userMysql);
    UserMysql mapDtoToUserMysql(Userdto userDto);
    UserMysqldto mapUserMysqlToUserMysqlDto(UserMysql userMysql);

}
