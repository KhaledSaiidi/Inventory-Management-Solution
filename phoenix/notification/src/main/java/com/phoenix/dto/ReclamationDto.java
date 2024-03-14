package com.phoenix.dto;

import com.phoenix.model.ReclamType;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReclamationDto {
    private Long id;
    private ReclamType reclamationType;
    private String reclamationText;
    private String senderReference;
    private String receiverReference;
    private String serialNumberOfReturnedStock;
    private String campaignReference;
    private String productType;
    private int quantityToAdd;
    private LocalDateTime reclamDate;
    private Boolean vued;

}
