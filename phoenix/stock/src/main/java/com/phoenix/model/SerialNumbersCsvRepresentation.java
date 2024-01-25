package com.phoenix.model;

import com.opencsv.bean.CsvBindByName;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SerialNumbersCsvRepresentation {
    @CsvBindByName(column = "serialNumber")
    private String serialNumber;
}
