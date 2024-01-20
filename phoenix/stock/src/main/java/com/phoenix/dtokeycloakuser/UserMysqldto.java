package com.phoenix.dtokeycloakuser;

import lombok.*;

import java.util.Date;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserMysqldto {
    private String username;
    private String firstName;
    private String lastName;
    private byte[] image;
    private String email;
    private Long phone;
    private String jobTitle;
    private Date dateDebutContrat;
    private Date dateFinContrat;
    private List<String> realmRoles;
    private boolean usertypemanager;

    private UserMysqldto manager;

}
