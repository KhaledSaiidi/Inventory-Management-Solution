package com.phoenix.model;

import com.opencsv.bean.CsvBindByName;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SerialNumbersCsvRepresentation {
    @CsvBindByName(column = "SHIPPED ESN")
    private String serialNumber;
    @CsvBindByName(column = "STATUS")
    private String status;
}
