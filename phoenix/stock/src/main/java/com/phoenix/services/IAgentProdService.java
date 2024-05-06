package com.phoenix.services;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.model.AgentProd;

import java.util.List;

public interface IAgentProdService {
    void assignAgentandManager(AgentProdDto agentOnProds, AgentProdDto managerOnProds);
    AgentProdDto UpdateAgentonProd(String agentRef, AgentProdDto agentProdDto);
    void detachAgentFromProduct(String serialNumber);
    void detachManagerFromProduct(String serialNumber);
    List<AgentProdDto> getAssignementByusername(String username);
    void UpdateAgentsbyUserssignementByusername(List<AgentProdDto> agentProdDtos);

    List<String> productsInPossession(String username);
    void deleteAgentProdsWithoutProducts();
    void deleteAgentwithUsername(String username);
    }
