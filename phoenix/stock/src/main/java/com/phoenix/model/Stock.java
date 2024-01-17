package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "t_stock")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Stock {
    @jakarta.persistence.Id
    private String stockReference;
    private List<String> productTypes;
    private String campaignRef;
    private LocalDate stockDate;
    private boolean checked;
    private String notes;

    @OneToMany(mappedBy = "stock", cascade = CascadeType.ALL)
    private List<Product> products;

    @PrePersist
    private void generateReference() {
        if (this.stockReference == null) {
            this.stockReference = generateRandomString(6);
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
