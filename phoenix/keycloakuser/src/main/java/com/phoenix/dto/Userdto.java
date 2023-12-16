package com.phoenix.dto;

import lombok.*;

import java.util.Date;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Userdto {
    private String firstName;
    private String lastName;
    private String email;
    private String userName;
    private String password;
    private List<String> realmRoles;
    private byte[] image;

    private Long phone;
    private String jobTitle;
    private Date dateDebutContrat;
    private Date dateFinContrat;


}
