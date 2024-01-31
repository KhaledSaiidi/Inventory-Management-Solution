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
    private List<ProductDto> productsManaged;
    private List<ProductDto> productsSoldBy;
    private List<ProductDto> productsAssociated;
    private List<ReclamationDto> reclamations;

}
