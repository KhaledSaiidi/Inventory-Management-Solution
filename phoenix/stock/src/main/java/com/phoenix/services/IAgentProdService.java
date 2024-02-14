package com.phoenix.services;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.model.AgentProd;

import java.util.List;

public interface IAgentProdService {
    List<AgentProdDto> assignAgentandManager(AgentProdDto agentOnProds, AgentProdDto managerOnProds);
    }
