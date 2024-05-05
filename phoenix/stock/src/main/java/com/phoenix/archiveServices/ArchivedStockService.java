package com.phoenix.archiveServices;

import com.phoenix.archivedmodel.ArchivedProducts;
import com.phoenix.archivedmodel.ArchivedSoldProducts;
import com.phoenix.archivedmodel.ArchivedStock;
import com.phoenix.archiverepo.IArchivedProductsRepo;
import com.phoenix.archiverepo.IArchivedSoldProductsRepo;
import com.phoenix.archiverepo.IArchivedStockRepo;
import com.phoenix.mapperToArchive.IProdToArchivedProd;
import com.phoenix.mapperToArchive.ISoldProdToArchivedSoldProd;
import com.phoenix.mapperToArchive.IStockToArchivedStock;
import com.phoenix.model.Product;
import com.phoenix.model.SoldProduct;
import com.phoenix.model.Stock;
import com.phoenix.repository.IProductRepository;
import com.phoenix.repository.ISoldProductRepository;
import com.phoenix.repository.IStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArchivedStockService implements IArchivedStockService{
    private final IArchivedStockRepo iArchivedStockRepo;
    private final IStockToArchivedStock iStockToArchivedStock;
    private final IStockRepository iStockRepository;
    private final IProdToArchivedProd iProdToArchivedProd;
    private final ISoldProdToArchivedSoldProd iSoldProdToArchivedSoldProd;
    private final IProductRepository iProductRepository;
    private final ISoldProductRepository iSoldProductRepository;
    private final IArchivedSoldProductsRepo iArchivedSoldProductsRepo;
    private final IArchivedProductsRepo iArchivedProductsRepo;

    @Override
    public void archiveStock(String campaignref) {
        iStockRepository.findByCampaignRef(campaignref).ifPresent(stocks -> {
            for (Stock stock : stocks) {
                ArchivedStock archivedStock = iStockToArchivedStock.toArchive(stock);
                iArchivedStockRepo.save(archivedStock);

                stock.getProducts().stream()
                        .map(iProdToArchivedProd::toarchive)
                        .forEach(iArchivedProductsRepo::save);
                iProductRepository.deleteAll(stock.getProducts());
                stock.setProducts(null);
                stock.getSoldproducts().stream()
                        .map(iSoldProdToArchivedSoldProd::toarchive)
                        .forEach(iArchivedSoldProductsRepo::save);
                iSoldProductRepository.deleteAll(stock.getSoldproducts());
                stock.setSoldproducts(null);
                iStockRepository.delete(stock);
            }
        });
    }
}
