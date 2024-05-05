package com.phoenix.archivedmodeldto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ArchivedProductsDTO {
    private String serialNumber;
    private String simNumber;
    private LocalDate checkin;
    private LocalDate checkout;
    private String boxNumber;
    private String productType;
    private String brand;
    private String prodName;
    private String comments;
    private BigDecimal price;
    private boolean returned;
    private boolean returnedstatus;
    private boolean checkedExistence;
    private String stockReference;
}
