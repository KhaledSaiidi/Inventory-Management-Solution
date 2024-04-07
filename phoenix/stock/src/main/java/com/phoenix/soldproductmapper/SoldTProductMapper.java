package com.phoenix.soldproductmapper;

import com.phoenix.dto.ProductDto;
import com.phoenix.model.Product;
import com.phoenix.model.SoldProduct;
import org.springframework.stereotype.Service;

@Service
public class SoldTProductMapper implements ISoldTProductMapper {

    @Override
    public SoldProduct tosoldProduct (Product product) {
        SoldProduct soldProduct = new SoldProduct();
        soldProduct.setSerialNumber(product.getSerialNumber());
        soldProduct.setSimNumber(product.getSimNumber());
        soldProduct.setBrand(product.getBrand());
        soldProduct.setProductType(product.getProductType());
        soldProduct.setProdName(product.getProdName());
        soldProduct.setComments(product.getComments());
        soldProduct.setPrice(product.getPrice());
        soldProduct.setStock(product.getStock());
        soldProduct.setManagerSoldProd(product.getManagerProd());
        soldProduct.setAgentAssociatedProd(product.getAgentProd());
        return soldProduct;
    }

    @Override
    public Product toProduct (SoldProduct soldProduct){
        Product product = new Product();
        product.setSerialNumber(soldProduct.getSerialNumber());
        product.setSimNumber(soldProduct.getSimNumber());
        product.setCheckout(soldProduct.getSoldDate());
        product.setBrand(soldProduct.getBrand());
        product.setProductType(soldProduct.getProductType());
        product.setProdName(soldProduct.getProdName());
        product.setComments(soldProduct.getComments());
        product.setPrice(soldProduct.getPrice());
        product.setReturned(true);
        product.setReturnedstatus(false);
        product.setStock(soldProduct.getStock());
        product.setManagerProd(soldProduct.getManagerSoldProd());
        product.setAgentProd(soldProduct.getAgentAssociatedProd());
        product.setAgentwhoSoldProd(soldProduct.getAgentWhoSold());
        return product;
    }



}
