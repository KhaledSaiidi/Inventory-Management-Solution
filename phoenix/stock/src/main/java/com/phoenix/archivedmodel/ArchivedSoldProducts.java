package com.phoenix.archivedmodel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "t_archivedsoldproducts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArchivedSoldProducts {
    @Id
    private String serialNumber;
    private String simNumber;
    private LocalDate soldDate;
    private boolean checkedSell;
    private String productType;
    private String brand;
    private String prodName;
    @Column(columnDefinition = "TEXT")
    private String comments;
    private BigDecimal price;
    @ManyToOne
    @JoinColumn(name = "stock_reference")
    private ArchivedStock stock;

}
