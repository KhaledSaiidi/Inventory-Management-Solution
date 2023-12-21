package com.phoenix.dto;

import com.phoenix.model.UserMysql;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
    private String username;
    private String password;
    private List<String> realmRoles;
    private byte[] image;

    private Long phone;
    private String jobTitle;
    private Date dateDebutContrat;
    private Date dateFinContrat;
    private boolean usertypemanager;

    private UserMysql manager;


}
