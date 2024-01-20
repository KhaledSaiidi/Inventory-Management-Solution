package com.phoenix.dto;

import com.phoenix.dtokeycloakuser.Campaigndto;
import lombok.*;

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
    private LocalDate stockDate;
    private boolean checked;
    private String notes;

    private Campaigndto campaigndto;

    private List<ProductDto> products;
}
