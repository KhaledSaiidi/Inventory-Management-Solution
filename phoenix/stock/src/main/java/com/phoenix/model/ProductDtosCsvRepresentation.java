package com.phoenix.model;

import com.opencsv.bean.CsvBindByName;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDtosCsvRepresentation {
    @CsvBindByName(column = "RECEIVED ESN")
    private String serialNumber;

    @CsvBindByName(column = "Shipped ESN")
    private String shippedserialNumber;
    @CsvBindByName(column = "COMMENTS")
    private String comments;

    @CsvBindByName(column = "BOX #")
    private String boxNumber;
    @CsvBindByName(column = "MATCH")
    private String checked;

    @CsvBindByName(column = "SENIOR ADVISOR")
    private String seniorAdvisor;
    @CsvBindByName(column = "AGENT ASSIGNED")
    private String agentAssigned;



    @CsvBindByName(column = "SHIPPED SIM")
    private String simNumber;
    @CsvBindByName(column = "DEVICE TYPE")
    private String productType;
    @CsvBindByName(column = "COST")
    private String cost;

}
