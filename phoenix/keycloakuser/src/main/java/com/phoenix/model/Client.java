package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "t_client")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Client {
    @jakarta.persistence.Id
    private String reference;

    private String companyName;
    private String companyemail;
    private Long companyphone;
    private String referentfirstName;

    private String referentlastName;
    private String referentemail;
    private Long referentphone;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    private List<Campaign> campaigns = new ArrayList<>();


    @PrePersist
    private void generateReference() {
        if (this.reference == null) {
            this.reference = generateRandomString(6);
        }
    }

    private String generateRandomString(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder randomString = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * characters.length());
            randomString.append(characters.charAt(index));
        }

        return randomString.toString();
    }

}
