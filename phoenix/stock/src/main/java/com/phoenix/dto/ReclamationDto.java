package com.phoenix.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

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
    private List<String> receiverReference;
    private List<String> vuedreceivers;
    private String serialNumberOfSolddProduct;
    private Date soldDate;
    private String serialNumberOfReturnedProduct;
    private Date returnedDate;
    private Date expirationDate;
    private int quantityToAdd;
    private LocalDateTime reclamDate;

}
