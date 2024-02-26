package com.phoenix.services;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.dto.SoldProductDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IsoldProductService {
    void sellProduct(String ProdRef, AgentProdDto agentsoldProdDto);
    Page<SoldProductDto> getSoldProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm);
}
