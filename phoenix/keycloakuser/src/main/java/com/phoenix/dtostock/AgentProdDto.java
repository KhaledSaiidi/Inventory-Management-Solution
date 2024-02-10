package com.phoenix.dtostock;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AgentProdDto {
    private String agentRef;
    private String firstname;
    private String lastname;
    private List<ProductDto> productsManaged;
    private List<ProductDto> productsSoldBy;
    private List<ProductDto> productsAssociated;
    private List<ReclamationDto> reclamations;

}
