package com.phoenix.archivedmodel;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "t_archivedproducts")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArchivedProducts {
    @Id
    private String serialNumber;
    private String simNumber;
    private LocalDate checkin;

    private LocalDate checkout;

    private String boxNumber;
    private String productType;
    private String brand;
    private String prodName;
    @Column(columnDefinition = "TEXT")
    private String comments;
    private BigDecimal price;
    private boolean returned;
    private boolean returnedstatus;
    private boolean checkedExistence;
    @ManyToOne
    @JoinColumn(name = "stock_reference")
    private ArchivedStock stock;

}
