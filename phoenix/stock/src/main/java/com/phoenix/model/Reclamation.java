package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "t_reclamation")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Reclamation {
    @jakarta.persistence.Id
    private Long id;
    @Enumerated(EnumType.STRING)
    private ReclamType reclamationType;
    @Lob
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
