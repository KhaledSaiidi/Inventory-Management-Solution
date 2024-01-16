package com.phoenix.mapper;

import com.phoenix.dto.ProductDto;
import com.phoenix.model.Product;

import java.util.List;

public interface IProductMapper {
    ProductDto toDto(Product product);
    Product toEntity(ProductDto productDto);
    List<ProductDto> toDtoList(List<Product> products);
    List<Product> toEntityList(List<ProductDto> productDtos);
}
