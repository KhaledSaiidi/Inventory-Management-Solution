package com.phoenix.stockdto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AgentProdDto {
    private String agentRef;
    private String username;
    private String firstname;
    private String lastname;
    private LocalDate affectaiondate;
    private LocalDate duesoldDate;
    private LocalDate receivedDate;
    private boolean seniorAdvisor;
    private List<ProductDto> productsManaged;
    private List<ProductDto> productsAssociated;
    private List<SoldProductDto> soldproductsManaged;
    private List<SoldProductDto> productsSoldBy;
    private List<SoldProductDto> agentproductsAssociated;
    private List<ProductDto> productssoldAndreturnedAssociated;
    private List<ProductDto> productsreturnedAssociated;

}
