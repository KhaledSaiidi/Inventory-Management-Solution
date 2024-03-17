package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "t_reclamation")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Reclamation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING)
    private ReclamType reclamationType;
    @Lob
    private String reclamationText;
    private String senderReference;
    private List<String> receiverReference;
    private List<String> vuedreceivers;
    private String serialNumberOfSolddProduct;
    private Date soldDate;
    private String serialNumberOfReturnedProduct;
    private String serialNumberExpired;
    private Date returnedDate;
    private Date expirationDate;
    private int quantityToAdd;
    private LocalDateTime reclamDate;

}
