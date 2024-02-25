package com.phoenix.soldproductmapper;

import com.phoenix.dto.ProductDto;
import com.phoenix.dto.SoldProductDto;
import com.phoenix.model.Product;
import com.phoenix.model.SoldProduct;

public interface ISoldTProductMapper {

    SoldProduct tosoldProduct (Product product);
    Product toProduct (SoldProduct soldProduct);

}
