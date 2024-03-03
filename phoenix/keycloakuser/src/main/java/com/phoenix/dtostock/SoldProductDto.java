package com.phoenix.dtostock;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SoldProductDto {
    private String serialNumber;
    private String simNumber;
    private LocalDate soldDate;
    private boolean checkedSell;
    private String productType;
    private String brand;
    private String prodName;
    private String comments;
    private BigDecimal price;
    private StockDto stock;
    private AgentProdDto managerSoldProd;
    private AgentProdDto agentWhoSold;
    private AgentProdDto agentAssociatedProd;
}

