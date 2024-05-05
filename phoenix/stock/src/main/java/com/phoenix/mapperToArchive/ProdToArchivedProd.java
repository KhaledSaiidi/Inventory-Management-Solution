package com.phoenix.mapperToArchive;

import com.phoenix.archivedmodel.ArchivedProducts;
import com.phoenix.model.Product;
import com.phoenix.model.SoldProduct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProdToArchivedProd implements IProdToArchivedProd{
    private final IStockToArchivedStock iStockToArchivedStock;

    @Override
    public ArchivedProducts toarchive (Product product) {
        ArchivedProducts archivedProduct = new ArchivedProducts();
        archivedProduct.setSerialNumber(product.getSerialNumber());
        archivedProduct.setSimNumber(product.getSimNumber());
        archivedProduct.setBrand(product.getBrand());
        archivedProduct.setProductType(product.getProductType());
        archivedProduct.setProdName(product.getProdName());
        archivedProduct.setComments(product.getComments());
        archivedProduct.setPrice(product.getPrice());
        archivedProduct.setCheckedExistence(product.isCheckedExistence());
        archivedProduct.setCheckin(product.getCheckin());
        archivedProduct.setCheckout(product.getCheckout());
        archivedProduct.setBoxNumber(product.getBoxNumber());
        archivedProduct.setReturned(product.isReturned());
        archivedProduct.setReturnedstatus(product.isReturnedstatus());
        archivedProduct.setStock(iStockToArchivedStock.toArchive(product.getStock()));
        return archivedProduct;
    }


}
