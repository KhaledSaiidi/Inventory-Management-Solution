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
        productDto.setSimNumber(product.getSimNumber());
        productDto.setCheckin(product.getCheckin());
        productDto.setCheckout(product.getCheckout());
        productDto.setBoxNumber(product.getBoxNumber());
        productDto.setBrand(product.getBrand());
        productDto.setProductType(product.getProductType());
        productDto.setProdName(product.getProdName());
        productDto.setComments(product.getComments());
        productDto.setPrice(product.getPrice());
        productDto.setReturned(product.isReturned());
        productDto.setReturnedstatus(product.isReturnedstatus());
        productDto.setCheckedExistence(product.isCheckedExistence());
        return productDto;
    }
    @Override
    public Product toEntity(ProductDto productDto) {
        Product product = new Product();
        product.setSerialNumber(productDto.getSerialNumber());
        product.setSimNumber(productDto.getSimNumber());
        product.setCheckin(productDto.getCheckin());
        product.setCheckout(productDto.getCheckout());
        product.setBoxNumber(productDto.getBoxNumber());
        product.setBrand(productDto.getBrand());
        product.setProductType(productDto.getProductType());
        product.setProdName(productDto.getProdName());
        product.setComments(productDto.getComments());
        product.setPrice(productDto.getPrice());
        product.setReturned(productDto.isReturned());
        product.setReturnedstatus(productDto.isReturnedstatus());
        product.setCheckedExistence(productDto.isCheckedExistence());
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
