package com.phoenix.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
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
    private Date stockDate;
    private boolean checked;
    @OneToMany(mappedBy = "stock", cascade = CascadeType.ALL)
    private List<Product> products;
}
