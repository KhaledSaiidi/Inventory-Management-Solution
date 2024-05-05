package com.phoenix.mapperToArchive;

import com.phoenix.archivedmodel.ArchivedSoldProducts;
import com.phoenix.model.Product;
import com.phoenix.model.SoldProduct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SoldProdToArchivedSoldProd implements ISoldProdToArchivedSoldProd {
    private final IStockToArchivedStock iStockToArchivedStock;
    @Override
    public ArchivedSoldProducts toarchive (SoldProduct soldProduct){
        ArchivedSoldProducts archivedSoldProducts = new ArchivedSoldProducts();
        archivedSoldProducts.setSerialNumber(soldProduct.getSerialNumber());
        archivedSoldProducts.setSimNumber(soldProduct.getSimNumber());
        archivedSoldProducts.setBrand(soldProduct.getBrand());
        archivedSoldProducts.setProductType(soldProduct.getProductType());
        archivedSoldProducts.setProdName(soldProduct.getProdName());
        archivedSoldProducts.setComments(soldProduct.getComments());
        archivedSoldProducts.setPrice(soldProduct.getPrice());
        archivedSoldProducts.setCheckedSell(soldProduct.isCheckedSell());
        archivedSoldProducts.setSoldDate(soldProduct.getSoldDate());
        archivedSoldProducts.setStock(iStockToArchivedStock.toArchive(soldProduct.getStock()));
        return archivedSoldProducts;
    }

}
