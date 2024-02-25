package com.phoenix.dto;

import com.phoenix.dtokeycloakuser.Campaigndto;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class StockDto {
    private String stockReference;
    private List<String> productTypes;
    private String campaignRef;
    private LocalDate shippingDate;
    private LocalDate receivedDate;
    private LocalDate dueDate;
    private boolean checked;
    private String notes;

    private Campaigndto campaigndto;
    private BigDecimal stockValue;

    private List<ProductDto> products;
    private List<SoldProductDto> soldproducts;

}
