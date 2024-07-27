package com.phoenix.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ParsedSoldProducts {
    private String serialNumber;
    private String status;
    private String agent;
    private LocalDate checkOut;
}
