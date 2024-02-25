package com.phoenix.services;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.dto.SoldProductDto;
import com.phoenix.mapper.IAgentProdMapper;
import com.phoenix.model.AgentProd;
import com.phoenix.model.Product;
import com.phoenix.model.SoldProduct;
import com.phoenix.repository.IAgentProdRepository;
import com.phoenix.repository.IProductRepository;
import com.phoenix.repository.ISoldProductRepository;
import com.phoenix.soldproductmapper.ISoldTProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SoldProductService  implements IsoldProductService{

    private final IProductRepository iProductRepository;
    private final ISoldProductRepository iSoldProductRepository;
    private final ISoldTProductMapper iSoldTProductMapper;
    private final IAgentProdMapper iAgentProdMapper;
    private final IAgentProdRepository iAgentProdRepository;

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

}
