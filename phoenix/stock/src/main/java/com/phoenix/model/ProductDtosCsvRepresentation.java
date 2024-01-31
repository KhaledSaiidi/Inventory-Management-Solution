package com.phoenix.model;

import com.opencsv.bean.CsvBindByName;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDtosCsvRepresentation {
    @CsvBindByName(column = "SHIPPED ESN")
    private String serialNumber;
    @CsvBindByName(column = "SHIPPED SIM")
    private String simNumber;
    @CsvBindByName(column = "DEVICE TYPE")
    private String productType;
}
