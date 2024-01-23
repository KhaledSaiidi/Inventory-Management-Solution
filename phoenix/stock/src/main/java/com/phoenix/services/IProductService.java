package com.phoenix.services;

import com.phoenix.dto.ProductDto;
import com.phoenix.model.Product;

import java.util.List;

public interface IProductService {
    void addProduct(ProductDto productDto);
    List<ProductDto> getProductsBystockReference(String stockreference);
    ProductDto UpdateProduct(String serialNumber, ProductDto productDto);
    ProductDto getProductByserialNumber(String serialNumber);


}
