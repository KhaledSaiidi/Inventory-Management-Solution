package com.phoenix.services;

import com.phoenix.dto.ProductDto;
import com.phoenix.dto.ReclamationDto;
import com.phoenix.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Set;

public interface IProductService {
    void addProduct(ProductDto productDto);
    List<ProductDto> getProductsBystockReference(String stockreference);
    Page<ProductDto> getProductsPaginatedBystockReference(Pageable pageable, String stockreference,String searchTermn);

    ProductDto UpdateProduct(String serialNumber, ProductDto productDto);
    ProductDto getProductByserialNumber(String serialNumber);

    Integer addProductsByupload(MultipartFile file, String stockReference) throws IOException;
    Page<ProductDto> getProductsPaginatedByusername(Pageable pageable, String username);
    void checkProds(String stockreference, Set<String> prodsref);
    Map<String, Integer> getProductsInfosBystockReference(String stockreference);

    Page<ProductDto> getReturnedProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm);
    List<ReclamationDto>  getProductsForAlert();
    Page<ProductDto> getProductsReturnedPaginatedByusername(Pageable pageable, String username);
    void checkReturn(String serialNumber);
    List<ProductDto> getThelast2ReturnedProdsByusername(String username);
    List<ProductDto> getThelastMonthlyReturnedProds();
    List<Integer> getUserStat(String username);
    int getProductNumberNow();
    Map<String, Float> getReturnedProductsStatistics();
    List<Integer> getProductsReturnedCount();
    void deleteProduct(String ref);

    List<ProductDto> getThelast4ReturnedProdsByusername(String username);

}
