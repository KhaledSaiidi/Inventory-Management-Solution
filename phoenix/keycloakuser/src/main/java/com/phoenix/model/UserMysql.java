package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "t_user")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserMysql {
    @jakarta.persistence.Id
    private String username;
    private String firstName;

    private String lastName;
    @Lob
    @Column(name = "image")
    private byte[] image;
    private String email;
    private Long phone;
    private String jobTitle;
    @Temporal(TemporalType.DATE)
    private Date dateDebutContrat;
    @Temporal(TemporalType.DATE)
    private Date dateFinContrat;


}