package com.phoenix.dtostock;

import lombok.*;

import java.time.LocalDate;

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
    private LocalDate reclamDate;
    private Boolean vued;

}
