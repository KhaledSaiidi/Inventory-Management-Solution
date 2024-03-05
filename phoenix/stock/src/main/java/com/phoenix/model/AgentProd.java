package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "t_agentProd")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AgentProd {
    @jakarta.persistence.Id
    private String agentRef;
    private String username;
    private String firstname;
    private String lastname;
    private LocalDate affectaiondate;
    private LocalDate duesoldDate;
    private LocalDate receivedDate;
    private boolean seniorAdvisor;
    @OneToMany(mappedBy = "managerProd")
    private List<Product> productsManaged;
    @OneToMany(mappedBy = "managerSoldProd")
    private List<SoldProduct> soldproductsManaged;
    @OneToMany(mappedBy = "agentWhoSold")
    private List<SoldProduct> productsSoldBy;
    @OneToMany(mappedBy = "agentProd")
    private List<Product> productsAssociated;
    @OneToMany(mappedBy = "agentAssociatedProd")
    private List<SoldProduct> agentproductsAssociated;


    @OneToMany(mappedBy = "agentwhoSoldProd")
    private List<Product> productssoldAndreturnedAssociated;
    @OneToMany(mappedBy = "agentReturnedProd")
    private List<Product> productsreturnedAssociated;

    @PrePersist
    private void generateReference() {
        if (this.agentRef == null) {
            this.agentRef = generateRandomString(6);
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
