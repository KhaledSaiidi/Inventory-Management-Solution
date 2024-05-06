package com.phoenix.archiveServices;

import com.phoenix.archiveMapper.IArchivedMapper;
import com.phoenix.archivedmodel.ArchivedProducts;
import com.phoenix.archivedmodel.ArchivedSoldProducts;
import com.phoenix.archivedmodel.ArchivedStock;
import com.phoenix.archivedmodeldto.ArchivedProductsDTO;
import com.phoenix.archivedmodeldto.ArchivedSoldProductsDTO;
import com.phoenix.archivedmodeldto.ArchivedStockDTO;
import com.phoenix.archiverepo.IArchivedProductsRepo;
import com.phoenix.archiverepo.IArchivedSoldProductsRepo;
import com.phoenix.archiverepo.IArchivedStockRepo;
import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.dto.SoldProductDto;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArchivedService implements IArchivedService {
    private final IArchivedStockRepo iArchivedStockRepo;
    private final IStockToArchivedStock iStockToArchivedStock;
    private final IStockRepository iStockRepository;
    private final IProdToArchivedProd iProdToArchivedProd;
    private final ISoldProdToArchivedSoldProd iSoldProdToArchivedSoldProd;
    private final IProductRepository iProductRepository;
    private final ISoldProductRepository iSoldProductRepository;
    private final IArchivedSoldProductsRepo iArchivedSoldProductsRepo;
    private final IArchivedProductsRepo iArchivedProductsRepo;
    private final IArchivedMapper iArchivedStockMapper;
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

    @Override
    public List<ArchivedStockDTO> archivedStocks(String campaignref) {
        Optional<List<ArchivedStock>> optionnalarchivedStocks = iArchivedStockRepo.findByCampaignRef(campaignref);
        if(optionnalarchivedStocks.isEmpty()){
            return null;
        }
        List<ArchivedStock> archivedStocks = optionnalarchivedStocks.get();
        List<ArchivedStockDTO> archivedStockDTOS = iArchivedStockMapper.toDtoList(archivedStocks);

        return archivedStockDTOS;
    }




    @Override
    public Page<ArchivedProductsDTO> getReturnedArchivedProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm) {

        Optional<ArchivedStock> stockOptional = iArchivedStockRepo.findById(stockreference);
        if (stockOptional.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }
        ArchivedStock stock = stockOptional.get();
        List<ArchivedProducts> products  = iArchivedProductsRepo.findByStockAndReturned(stock, true);
        List<ArchivedProductsDTO> productDtos = iArchivedStockMapper.toarchivedProductsDtoList(products);
        if (!searchTerm.isEmpty()) {
            productDtos = productDtos.parallelStream()
                    .filter(productDto -> filterBySearchTerm(productDto, searchTerm))
                    .collect(Collectors.toList());
        }
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<ArchivedProductsDTO> pageContent;
        if (productDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, productDtos.size());
            pageContent = productDtos.subList(startItem, toIndex);
        }
        return new PageImpl<>(pageContent, pageable, productDtos.size());
    }


    @Override
    public Page<ArchivedProductsDTO> getArchivedProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm) {

        Optional<ArchivedStock> stockOptional = iArchivedStockRepo.findById(stockreference);
        if (stockOptional.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }
        ArchivedStock stock = stockOptional.get();
        List<ArchivedProducts> products  = iArchivedProductsRepo.findByStockAndReturned(stock, false);
        List<ArchivedProductsDTO> productDtos = iArchivedStockMapper.toarchivedProductsDtoList(products);
        if (!searchTerm.isEmpty()) {
            productDtos = productDtos.parallelStream()
                    .filter(productDto -> filterBySearchTerm(productDto, searchTerm))
                    .collect(Collectors.toList());
        }
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<ArchivedProductsDTO> pageContent;
        if (productDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, productDtos.size());
            pageContent = productDtos.subList(startItem, toIndex);
        }
        return new PageImpl<>(pageContent, pageable, productDtos.size());
    }


    private boolean filterBySearchTerm(ArchivedProductsDTO productDto, String searchTerm) {
        String searchString = searchTerm.toLowerCase();
        StringBuilder searchFields = new StringBuilder();
        searchFields.append(productDto.getSerialNumber().toLowerCase())
                .append(productDto.getSimNumber().toLowerCase());
        return searchFields.toString().contains(searchString);
    }


    @Override
    public Page<ArchivedSoldProductsDTO> getArchivedSoldProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm) {

        Optional<ArchivedStock> stockOptional = iArchivedStockRepo.findById(stockreference);
        if (stockOptional.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }
        ArchivedStock stock = stockOptional.get();
        List<ArchivedSoldProducts> soldproducts  = iArchivedSoldProductsRepo.findByStock(stock);
        List<ArchivedSoldProductsDTO> soldProductDtos = iArchivedStockMapper.toarchivedSoldProductsDtoList(soldproducts);
        if (!searchTerm.isEmpty()) {
            soldProductDtos = soldProductDtos.parallelStream()
                    .filter(soldProductDto -> filterSoldBySearchTerm(soldProductDto, searchTerm))
                    .collect(Collectors.toList());
        }
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<ArchivedSoldProductsDTO> pageContent;
        if (soldProductDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, soldProductDtos.size());
            pageContent = soldProductDtos.subList(startItem, toIndex);
        }
        return new PageImpl<>(pageContent, pageable, soldProductDtos.size());
    }



    private boolean filterSoldBySearchTerm(ArchivedSoldProductsDTO soldProductDto, String searchTerm) {
        String searchString = searchTerm.toLowerCase();
        StringBuilder searchFields = new StringBuilder();
        searchFields.append(soldProductDto.getSerialNumber().toLowerCase())
                .append(soldProductDto.getSimNumber().toLowerCase());
        return searchFields.toString().contains(searchString);
    }

    @Override
    public void deletearchive(String campaignReference){
        Optional<List<ArchivedStock>> optionnalarchivedStocks = iArchivedStockRepo.findByCampaignRef(campaignReference);
        if(optionnalarchivedStocks.isEmpty()){
            return;
        } else {
            List<ArchivedStock> archivedStocks = optionnalarchivedStocks.get();
            for (ArchivedStock archivedStock: archivedStocks){
                List<ArchivedProducts> products = archivedStock.getProducts();
                List<ArchivedSoldProducts> archivedSoldProducts = archivedStock.getSoldproducts();
                if(products != null){
                    iArchivedProductsRepo.deleteAll(products);
                    archivedStock.setProducts(null);
                }
                if(archivedSoldProducts != null){
                    iArchivedSoldProductsRepo.deleteAll(archivedSoldProducts);
                    archivedStock.setSoldproducts(null);
                }
                iArchivedStockRepo.delete(archivedStock);
            }
        }

    }

}
