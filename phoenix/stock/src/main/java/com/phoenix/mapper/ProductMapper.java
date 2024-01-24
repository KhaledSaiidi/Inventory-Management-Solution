package com.phoenix.mapper;

import com.phoenix.dto.ProductDto;
import com.phoenix.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductMapper implements IProductMapper{
    @Override
    public ProductDto toDto(Product product) {
        ProductDto productDto = new ProductDto();
        productDto.setSerialNumber(product.getSerialNumber());
        productDto.setProductType(product.getProductType());
        productDto.setProdName(product.getProdName());
        productDto.setBrand(product.getBrand());
        productDto.setProdDescription(product.getProdDescription());
        productDto.setPrice(product.getPrice());
        productDto.setState(product.getState());
        productDto.setChecked(product.isChecked());
        productDto.setSoldDate(product.getSoldDate());
        return productDto;
    }
    @Override
    public Product toEntity(ProductDto productDto) {
        Product product = new Product();
        product.setSerialNumber(productDto.getSerialNumber());
        product.setProductType(productDto.getProductType());
        product.setProdName(productDto.getProdName());
        product.setBrand(productDto.getBrand());
        product.setProdDescription(productDto.getProdDescription());
        product.setPrice(productDto.getPrice());
        product.setState(productDto.getState());
        product.setChecked(productDto.isChecked());
        product.setSoldDate(productDto.getSoldDate());
        return product;
    }
    @Override
    public List<ProductDto> toDtoList(List<Product> products) {
        return products.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Product> toEntityList(List<ProductDto> productDtos) {
        return productDtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

}
