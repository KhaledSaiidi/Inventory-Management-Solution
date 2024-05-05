package com.phoenix.archivedmodeldto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArchivedSoldProductsDTO {
    private String serialNumber;
    private String simNumber;
    private LocalDate soldDate;
    private boolean checkedSell;
    private String productType;
    private String brand;
    private String prodName;
    private String comments;
    private BigDecimal price;
    private String stockReference;

}
