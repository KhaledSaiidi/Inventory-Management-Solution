package com.phoenix.services;

import com.phoenix.config.KeycloakSecurityUtil;
import com.phoenix.dto.UserMysqldto;
import com.phoenix.dto.Userdto;
import com.phoenix.mapper.IMapper;
import com.phoenix.mapper.UserMapper;
import com.phoenix.model.UserMysql;
import com.phoenix.repository.UserMysqlRepository;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.RoleRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServices implements IUserServices {
    @Autowired
    KeycloakSecurityUtil keycloakUtil;

    private final UserMysqlRepository userRepository;
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
    @Override
    public Userdto addUser(Userdto userDto) {
        if (userRepository.existsByUsername(userDto.getUserName())) {
            throw new DataIntegrityViolationException("Username already exists: " + userDto.getUserName());
        }
        UserMysql userMysql = iMapper.mapDtoToUserMysql(userDto);
        userMysql.setImage(userDto.getImage());
        userMysql.setPhone(userDto.getPhone());
        userMysql.setJobTitle(userDto.getJobTitle());
        userMysql.setDateDebutContrat(userDto.getDateDebutContrat());
        userMysql.setDateFinContrat(userDto.getDateFinContrat());
        UserMysql savedUser = userRepository.save(userMysql);
        return iMapper.mapUserMysqlToDto(savedUser);
    }

    @Override
    public UserMysqldto getUserByUsername(String username) {
        Optional<UserMysql> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            UserMysql userMysql = userOptional.get();
            return iMapper.mapUserMysqlToUserMysqlDto(userMysql);
        }
        return null;
    }



}
