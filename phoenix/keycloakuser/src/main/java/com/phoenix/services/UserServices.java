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
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new DataIntegrityViolationException("Username already exists: " + userDto.getUsername());
        }
        UserMysql userMysql = iMapper.mapDtoToUserMysql(userDto);
        userMysql.setImage(userDto.getImage());
        userMysql.setPhone(userDto.getPhone());
        userMysql.setJobTitle(userDto.getJobTitle());
        userMysql.setDateDebutContrat(userDto.getDateDebutContrat());
        userMysql.setDateFinContrat(userDto.getDateFinContrat());
        userMysql.setRealmRoles(userDto.getRealmRoles());
        userMysql.setUsertypemanager(userDto.isUsertypemanager());
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

    @Override
    public List<Userdto> getallUsers() {
        List<UserMysql> users = userRepository.findAll();
        List<Userdto> usersdtos = new ArrayList<>();
        if (!users.isEmpty()) {
            for (UserMysql userMysql : users) {
                Userdto userdto = new Userdto();
                userdto = iMapper.mapUserMysqlToDto(userMysql);
                userdto.setImage(null);
                if(userdto.getManager() != null) {
                    userdto.getManager().setImage(null);
                }
                usersdtos.add(userdto);
            }

        return usersdtos;
    }
        return null;
    }

    @Override
    public Userdto UpdateUser(String userId, Userdto userDto) {
        System.out.println("service:" + userId);
        UserMysql user = userRepository.findByUsername(userId).orElse(null);
        if (user == null) {
            return null;
        }

        if (userDto.getFirstName() != null) {
            user.setFirstName(userDto.getFirstName());
        }
        if (userDto.getLastName() != null) {
            user.setLastName(userDto.getLastName());
        }
        if (userDto.getEmail() != null) {
            user.setEmail(userDto.getEmail());
        }
        if(userDto.getImage() != null){
            user.setImage(userDto.getImage());

        }
        if (userDto.getPhone() != null) {
            user.setPhone(userDto.getPhone());
        }
        if (userDto.getJobTitle() != null) {
            user.setJobTitle(userDto.getJobTitle());
        }
        if (userDto.getRealmRoles() != null) {
            user.setRealmRoles(userDto.getRealmRoles());
        }

        if (userDto.getDateDebutContrat() != null) {
            user.setDateDebutContrat(userDto.getDateDebutContrat());
        }
        if (userDto.getDateFinContrat() != null) {
            user.setDateFinContrat(userDto.getDateFinContrat());
        }
        UserMysql manager = null;
        if (userDto.getManager() != null && userDto.getManager().getUsername() != null) {

            manager = userRepository.findByUsername(userDto.getManager().getUsername()).orElse(null);
            user.setManager(manager);
        }

        UserMysql saveduser = userRepository.save(user);
        return userDto;
    }

    @Override
    public void DeleteUser(String userId) {
        Optional<UserMysql> userOptional = userRepository.findByUsername(userId);
        userOptional.ifPresent(userRepository::delete);
        }

}
