package com.phoenix.services;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.mapper.IAgentProdMapper;
import com.phoenix.mapper.IProductMapper;
import com.phoenix.mapper.IStockMapper;
import com.phoenix.model.AgentProd;
import com.phoenix.model.Product;
import com.phoenix.model.State;
import com.phoenix.model.Stock;
import com.phoenix.repository.IAgentProdRepository;
import com.phoenix.repository.IProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentProdService implements IAgentProdService{
    @Autowired
    private IAgentProdMapper iAgentProdMapper;
    @Autowired
    private IProductMapper iProductMapper;
    @Autowired
    private IStockMapper iStockMapper;


    @Autowired
    private IAgentProdRepository iAgentProdRepository;
    @Autowired
    private IProductRepository iProductRepository;

    @Override
    @Transactional
    public List<AgentProdDto> assignAgentandManager(AgentProdDto agentOnProds, AgentProdDto managerOnProds) {
        if (agentOnProds == null && managerOnProds == null) {
            throw new IllegalArgumentException("At least one AgentProdDto must be provided");
        }
        List<ProductDto> productsdtoToassign = agentOnProds != null ?
                agentOnProds.getProductsAssociated() : managerOnProds.getProductsAssociated();
        List<Product> productsToassign = iProductMapper.toEntityList(productsdtoToassign);
        for (int i = 0; i < productsToassign.size(); i++) {
            Product product = productsToassign.get(i);
            ProductDto productDto = productsdtoToassign.get(i);
            if(productDto.getStock() != null) {
                StockDto stockDto = productDto.getStock();
                product.setStock(iStockMapper.toEntity(stockDto));
            }
        }
        LocalDate currentDate = LocalDate.now();
        AgentProd agentProd = null;
        AgentProd managerProd = null;
        if (agentOnProds != null) {
            agentProd = iAgentProdMapper.toEntity(agentOnProds);
            agentProd.setAffectaiondate(currentDate);
        }
        if (managerOnProds != null) {
            managerProd = iAgentProdMapper.toEntity(managerOnProds);
            managerProd.setAffectaiondate(currentDate);
        }
        List<AgentProd> agentProdsToSave = new ArrayList<>();
        if (agentProd != null) agentProdsToSave.add(agentProd);
        if (managerProd != null) agentProdsToSave.add(managerProd);
        List<AgentProdDto> agentProdsDtoSaved = new ArrayList<>();
        if (!agentProdsToSave.isEmpty()) {
            iAgentProdRepository.saveAll(agentProdsToSave);
            agentProdsDtoSaved = iAgentProdMapper.toDtoList(agentProdsToSave);
            for(Product product: productsToassign) {
                if (agentProd != null) {
                    product.setAgentProd(agentProd);
                }
                if (managerProd != null) {
                    product.setManagerProd(managerProd);
                }
                iProductRepository.save(product);
            }
        } else {
            throw new IllegalStateException("No AgentProd entities to save.");
        }
        return agentProdsDtoSaved;
    }

}
