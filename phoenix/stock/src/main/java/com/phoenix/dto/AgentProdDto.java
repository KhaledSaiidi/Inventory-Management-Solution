package com.phoenix.dto;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AgentProdDto {
    private String agentRef;
    private String agentManagerReference;
    private List<ProductDto> products;
    private List<ReclamationDto> reclamations;

}
