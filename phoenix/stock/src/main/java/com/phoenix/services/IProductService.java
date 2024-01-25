package com.phoenix.services;

import com.phoenix.dto.ProductDto;
import com.phoenix.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

public interface IProductService {
    void addProduct(ProductDto productDto);
    List<ProductDto> getProductsBystockReference(String stockreference);
    ProductDto UpdateProduct(String serialNumber, ProductDto productDto);
    ProductDto getProductByserialNumber(String serialNumber);

    List<String> uploadProducts(MultipartFile file, String stockReference) throws IOException;


}
