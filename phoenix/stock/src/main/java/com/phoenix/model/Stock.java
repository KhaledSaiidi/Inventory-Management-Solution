package com.phoenix.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
}
