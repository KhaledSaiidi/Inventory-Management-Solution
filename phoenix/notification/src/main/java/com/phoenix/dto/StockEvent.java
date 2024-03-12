package com.phoenix.dto;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StockEvent {
    private String message;
    private String status;
    private String body;
}
