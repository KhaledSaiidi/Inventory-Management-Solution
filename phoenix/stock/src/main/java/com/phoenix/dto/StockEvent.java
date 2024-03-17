package com.phoenix.dto;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StockEvent {
    private String message;
    private String status;
    private List<ReclamationDto> reclamationDtos;
}
