package com.phoenix.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "t_agentProd")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AgentProd {
    @jakarta.persistence.Id
    private String agentRef;
    private String agentManagerReference;
    @OneToMany(mappedBy = "agentProd", cascade = CascadeType.ALL)
    private List<Product> products;
    @OneToMany(mappedBy = "agentProd", cascade = CascadeType.ALL)
    private List<Reclamation> reclamations;
}
