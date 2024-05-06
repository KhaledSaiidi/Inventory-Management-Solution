package com.phoenix.archivedmodel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "t_archivedstock")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArchivedStock {
    @Id
    private String stockReference;
    private List<String> productTypes;
    private String campaignRef;
    private LocalDate shippingDate;
    private LocalDate receivedDate;
    private LocalDate dueDate;
    private boolean checked;
    private String notes;
    private BigDecimal stockValue;

    @OneToMany(mappedBy = "stock", fetch = FetchType.EAGER)
    private List<ArchivedProducts> products;
    @OneToMany(mappedBy = "stock", fetch = FetchType.EAGER)
    private List<ArchivedSoldProducts> soldproducts;

}
