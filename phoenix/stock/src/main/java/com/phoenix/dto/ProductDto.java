package com.phoenix.dto;

import com.phoenix.model.State;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    private String serialNumber;
    private String productType;
    private String prodName;
    private String prodDescription;
    private BigDecimal price;
    private State state;
    private LocalDate soldDate;
    private StockDto stock;
    private AgentProdDto agentProd;
}
