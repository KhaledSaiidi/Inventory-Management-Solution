package com.phoenix.services;

import com.phoenix.dto.ProductDto;

import java.util.List;

public interface IProductService {
    void addProduct(ProductDto productDto);
    List<ProductDto> getProductsBystockReference(String stockreference);
}
