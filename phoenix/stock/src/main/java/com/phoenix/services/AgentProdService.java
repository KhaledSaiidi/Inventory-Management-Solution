package com.phoenix.services;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.mapper.IAgentProdMapper;
import com.phoenix.mapper.IProductMapper;
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

        LocalDate currentDate = LocalDate.now();

        AgentProd agentProd = null;
        AgentProd managerProd = null;
        if (agentOnProds != null) {
            agentProd = iAgentProdMapper.toEntity(agentOnProds);
            agentProd.setAffectaiondate(currentDate);
            agentProd.setProductsAssociated(productsToassign);
        }
        if (managerOnProds != null) {
            managerProd = iAgentProdMapper.toEntity(managerOnProds);
            managerProd.setAffectaiondate(currentDate);
            managerProd.setProductsManaged(productsToassign);
        }
        List<AgentProd> agentProdsToSave = new ArrayList<>();
        if (agentProd != null) agentProdsToSave.add(agentProd);
        if (managerProd != null) agentProdsToSave.add(managerProd);
        List<AgentProdDto> agentProdsDtoSaved = new ArrayList<>();
        if (!agentProdsToSave.isEmpty()) {
            iAgentProdRepository.saveAll(agentProdsToSave);
            agentProdsDtoSaved = iAgentProdMapper.toDtoList(agentProdsToSave);
        } else {
            throw new IllegalStateException("No AgentProd entities to save.");
        }
        return agentProdsDtoSaved;
    }

}
