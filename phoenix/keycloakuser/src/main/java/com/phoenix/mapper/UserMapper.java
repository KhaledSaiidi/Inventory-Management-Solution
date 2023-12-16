package com.phoenix.mapper;

import com.phoenix.config.KeycloakSecurityUtil;
import com.phoenix.dto.UserMysqldto;
import com.phoenix.dto.Userdto;
import com.phoenix.model.UserMysql;
import org.keycloak.common.util.CollectionUtil;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserMapper implements IMapper {

    @Autowired
    KeycloakSecurityUtil keycloakUtil;
    @Value("${realm}")
    private String realm;

    @Override
    public List<Userdto> mapUsers(List<UserRepresentation> userRepresentations){
        List<Userdto> userdtos = new ArrayList<>();
        if (CollectionUtil.isNotEmpty(userRepresentations)){
            userRepresentations.forEach(userRep -> {
                userdtos.add(mapUser(userRep));
            });
        }
        return userdtos;
    }
    @Override
    public Userdto mapUser(UserRepresentation userRep){
        Userdto userdto = new Userdto();
        userdto.setFirstName(userRep.getFirstName());
        userdto.setLastName(userRep.getLastName());
        userdto.setEmail(userRep.getEmail());
        userdto.setUserName(userRep.getUsername());
        return userdto;
    }

    @Override
    public UserRepresentation mapUserRep(Userdto userdto){
        UserRepresentation userRep = new UserRepresentation();
        userRep.setUsername(userdto.getUserName());
        userRep.setFirstName(userdto.getFirstName());
        userRep.setLastName(userdto.getLastName());
        userRep.setEmail(userdto.getEmail());
        userRep.setEnabled(true);
        userRep.setEmailVerified(false);
        List<CredentialRepresentation> creds = new ArrayList<>();
        CredentialRepresentation cred = new CredentialRepresentation();
        cred.setTemporary(true);
        cred.setValue(userdto.getPassword());
        creds.add(cred);
        userRep.setCredentials(creds);
        // Set realm roles
        userRep.setRealmRoles(userdto.getRealmRoles());

        return userRep;
    }
    @Override
    public Userdto mapUserMysqlToDto(UserMysql userMysql) {
        if (userMysql == null) {
            return null;
        }
        Userdto userDto = new Userdto();
        userDto.setFirstName(userMysql.getFirstName());
        userDto.setLastName(userMysql.getLastName());
        userDto.setEmail(userMysql.getEmail());
        userDto.setUserName(userMysql.getUsername());
        userDto.setPhone(userMysql.getPhone());
        userDto.setJobTitle(userMysql.getJobTitle());
        userDto.setDateDebutContrat(userMysql.getDateDebutContrat());
        userDto.setDateFinContrat(userMysql.getDateFinContrat());
        userDto.setRealmRoles(userMysql.getRealmRoles());
        return userDto;
    }
    @Override
    public UserMysql mapDtoToUserMysql(Userdto userDto) {
        if (userDto == null) {
            return null;
        }
        UserMysql userMysql = new UserMysql();
        userMysql.setFirstName(userDto.getFirstName());
        userMysql.setLastName(userDto.getLastName());
        userMysql.setEmail(userDto.getEmail());
        userMysql.setUsername(userDto.getUserName());
        userMysql.setRealmRoles(userDto.getRealmRoles());
        return userMysql;
    }

    @Override
    public UserMysqldto mapUserMysqlToUserMysqlDto(UserMysql userMysql) {
        if (userMysql == null) {
            return null;
        }
        UserMysqldto userMysqlDto = new UserMysqldto();
        userMysqlDto.setFirstName(userMysql.getFirstName());
        userMysqlDto.setLastName(userMysql.getLastName());
        userMysqlDto.setEmail(userMysql.getEmail());
        userMysqlDto.setUsername(userMysql.getUsername());
        userMysqlDto.setImage(userMysql.getImage());
        userMysqlDto.setPhone(userMysql.getPhone());
        userMysqlDto.setJobTitle(userMysql.getJobTitle());
        userMysqlDto.setDateDebutContrat(userMysql.getDateDebutContrat());
        userMysqlDto.setDateFinContrat(userMysql.getDateFinContrat());
        userMysqlDto.setRealmRoles(userMysql.getRealmRoles());
        return userMysqlDto;
    }


}
