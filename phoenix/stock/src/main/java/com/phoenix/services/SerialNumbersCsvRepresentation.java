package com.phoenix.services;

import com.opencsv.bean.CsvBindByName;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SerialNumbersCsvRepresentation {
    @CsvBindByName(column = "SerialNumber")
    private String serialNumber;
}
