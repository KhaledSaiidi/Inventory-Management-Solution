package com.phoenix.services;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.dto.SoldProductDto;
import com.phoenix.mapper.IAgentProdMapper;
import com.phoenix.mapper.ISoldProductDtoMapper;
import com.phoenix.model.AgentProd;
import com.phoenix.model.Product;
import com.phoenix.model.SoldProduct;
import com.phoenix.model.Stock;
import com.phoenix.repository.IAgentProdRepository;
import com.phoenix.repository.IProductRepository;
import com.phoenix.repository.ISoldProductRepository;
import com.phoenix.repository.IStockRepository;
import com.phoenix.soldproductmapper.ISoldTProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SoldProductService  implements IsoldProductService{

    private final IProductRepository iProductRepository;
    private final ISoldProductRepository iSoldProductRepository;
    private final ISoldTProductMapper iSoldTProductMapper;
    private final ISoldProductDtoMapper iSoldProductDtoMapper;
    private final IAgentProdMapper iAgentProdMapper;
    private final IAgentProdRepository iAgentProdRepository;
    private final IStockRepository iStockRepository;

    @Override
    public void sellProduct(String prodRef, AgentProdDto agentsoldProdDto){
        LocalDate soldDate = LocalDate.now();
        Optional<Product> optionalProduct = iProductRepository.findById(prodRef);
        if(optionalProduct.isPresent()){


        Product product = optionalProduct.get();
        SoldProduct soldProduct = iSoldTProductMapper.tosoldProduct(product);

        AgentProd agentsoldProd = iAgentProdMapper.toEntity(agentsoldProdDto);
        if(product.getAgentProd().getAffectaiondate() != null) {
            agentsoldProd.setAffectaiondate(product.getAgentProd().getAffectaiondate());
        }
        if(product.getAgentProd().getDuesoldDate() != null) {
            agentsoldProd.setDuesoldDate(product.getAgentProd().getDuesoldDate());
        }
        if(product.getAgentProd().getReceivedDate() != null) {
            agentsoldProd.setReceivedDate(product.getAgentProd().getReceivedDate());
        }
        iAgentProdRepository.save(agentsoldProd);

        soldProduct.setCheckedSell(false);
        soldProduct.setAgentWhoSold(agentsoldProd);
        soldProduct.setSoldDate(soldDate);

        iProductRepository.delete(product);
        iSoldProductRepository.save(soldProduct);

        }
    }


    @Override
    public Page<SoldProductDto> getSoldProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm) {

        Optional<Stock> stockOptional = iStockRepository.findById(stockreference);
        if (stockOptional.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }
        Stock stock = stockOptional.get();
        List<SoldProduct> soldproducts  = iSoldProductRepository.findByStock(stock);
        List<SoldProductDto> soldProductDtos = iSoldProductDtoMapper.toDtoList(soldproducts);
        for (int i = 0; i < soldProductDtos.size(); i++) {
            SoldProduct soldproduct = soldproducts.get(i);
            SoldProductDto soldproductDto = soldProductDtos.get(i);
            if(soldproduct.getAgentAssociatedProd() != null){
                AgentProdDto agentProdDto = iAgentProdMapper.toDto(soldproduct.getAgentAssociatedProd());
                soldproductDto.setAgentAssociatedProd(agentProdDto);
            }
            if(soldproduct.getManagerSoldProd() != null){
                AgentProdDto managerProdDto = iAgentProdMapper.toDto(soldproduct.getManagerSoldProd());
                soldproductDto.setManagerSoldProd(managerProdDto);
            }
            if(soldproduct.getAgentWhoSold() != null){
                AgentProdDto agentSoldProdDto = iAgentProdMapper.toDto(soldproduct.getAgentWhoSold());
                soldproductDto.setAgentWhoSold(agentSoldProdDto);
            }
        }
        if (!searchTerm.isEmpty()) {
            soldProductDtos = soldProductDtos.parallelStream()
                    .filter(soldProductDto -> filterBySearchTerm(soldProductDto, searchTerm))
                    .collect(Collectors.toList());
        }
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<SoldProductDto> pageContent;
        if (soldProductDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, soldProductDtos.size());
            pageContent = soldProductDtos.subList(startItem, toIndex);
        }
        return new PageImpl<>(pageContent, pageable, soldProductDtos.size());
    }
    private boolean filterBySearchTerm(SoldProductDto soldProductDto, String searchTerm) {
        String searchString = searchTerm.toLowerCase();
        StringBuilder searchFields = new StringBuilder();
        searchFields.append(soldProductDto.getSerialNumber().toLowerCase())
                .append(soldProductDto.getSimNumber().toLowerCase());
        if (soldProductDto.getAgentWhoSold() != null) {
            searchFields.append(soldProductDto.getAgentWhoSold().getFirstname().toLowerCase())
                    .append(soldProductDto.getAgentWhoSold().getLastname().toLowerCase());
        }
        if (soldProductDto.getManagerSoldProd() != null) {
            searchFields.append(soldProductDto.getManagerSoldProd().getFirstname().toLowerCase())
                    .append(soldProductDto.getManagerSoldProd().getLastname().toLowerCase());
        }
        if (soldProductDto.getAgentAssociatedProd() != null) {
            searchFields.append(soldProductDto.getAgentAssociatedProd().getFirstname().toLowerCase())
                    .append(soldProductDto.getAgentAssociatedProd().getLastname().toLowerCase());
        }
        return searchFields.toString().contains(searchString);
    }



}
