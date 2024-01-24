package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "t_product")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @jakarta.persistence.Id
    private String serialNumber;
    private String productType;
    private String brand;
    private String prodName;
    @Column(columnDefinition = "TEXT")
    private String prodDescription;
    private BigDecimal price;
    @Enumerated(EnumType.STRING)
    private State state;
    private LocalDate soldDate;
    private boolean checked;
    @ManyToOne
    @JoinColumn(name = "stock_reference")
    private Stock stock;
    @ManyToOne
    @JoinColumn(name = "agent_ref")
    private AgentProd agentProd;
}
