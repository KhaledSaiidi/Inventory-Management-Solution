package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "t_soldProduct")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class SoldProduct {
    @jakarta.persistence.Id
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
    private Stock stock;
    @ManyToOne
    @JoinColumn(name = "manager_sold_prod_ref")
    private AgentProd managerSoldProd;
    @ManyToOne
    @JoinColumn(name = "agent_who_sold_ref")
    private AgentProd agentWhoSold;
    @ManyToOne
    @JoinColumn(name = "agent_associated_prod_ref")
    private AgentProd agentAssociatedProd;

}
