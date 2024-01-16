package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private String reclamationText;
    private String senderReference;
    private String receiverReference;
    private String serialNumberOfReturnedStock;
    private String campaignReference;
    private String productType;
    private int quantityToAdd;
    @ManyToOne
    @JoinColumn(name = "agent_ref")
    private AgentProd agentProd;
}
