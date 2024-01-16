package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private String prodName;
    private String prodDescription;
    private float price;
    @Enumerated(EnumType.STRING)
    private State state;
    private Date soldDate;
    @ManyToOne
    @JoinColumn(name = "stock_reference")
    private Stock stock;
    @ManyToOne
    @JoinColumn(name = "agent_ref")
    private AgentProd agentProd;
}
