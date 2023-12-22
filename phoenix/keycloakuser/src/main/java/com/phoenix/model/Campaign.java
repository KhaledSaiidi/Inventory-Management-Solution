package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "t_campaign")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Campaign {
    @jakarta.persistence.Id
    private String reference;

    private String campaignName;
    private String campaignDescription;
    private List<String> products;
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @ManyToOne
    @JoinColumn(name = "client_reference", nullable = false)
    private Client client;

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
