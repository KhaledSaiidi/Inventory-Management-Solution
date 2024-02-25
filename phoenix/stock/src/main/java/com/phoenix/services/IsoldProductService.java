package com.phoenix.services;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.dto.SoldProductDto;

public interface IsoldProductService {
    void sellProduct(String ProdRef, AgentProdDto agentsoldProdDto);
}
