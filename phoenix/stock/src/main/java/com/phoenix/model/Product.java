package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "t_product")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    @jakarta.persistence.Id
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
    private Stock stock;
    @ManyToOne
    @JoinColumn(name = "manager_prod_ref")
    private AgentProd managerProd;
    @ManyToOne
    @JoinColumn(name = "agent_prod_ref")
    private AgentProd agentProd;


    @ManyToOne
    @JoinColumn(name = "agent_soldiT_prod_ref")
    private AgentProd agentwhoSoldProd;
    @ManyToOne
    @JoinColumn(name = "agent_returned_prod_ref")
    private AgentProd agentReturnedProd;

}