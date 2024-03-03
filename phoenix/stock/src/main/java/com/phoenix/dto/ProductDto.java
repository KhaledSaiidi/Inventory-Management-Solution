package com.phoenix.dto;

import com.phoenix.model.AgentProd;
import com.phoenix.model.State;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDto {
    private String serialNumber;
    private String simNumber;
    private LocalDate checkin;
    private LocalDate checkout;
    private String boxNumber;
    private String brand;
    private String productType;
    private String prodName;
    private String comments;
    private BigDecimal price;
    private State state;
    private boolean checkedExistence;
    private StockDto stock;
    private AgentProdDto agentProd;
    private AgentProdDto managerProd;
}
