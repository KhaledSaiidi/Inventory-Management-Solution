package com.phoenix.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TopSalesDto {
    private String fullname;
    private int totalsales;
    private int totalsalesLastMonth;
    private float growth;
}
