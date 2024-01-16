package com.phoenix.mapper;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.model.AgentProd;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgentProdMapper implements IAgentProdMapper{
    @Override
    public AgentProdDto toDto(AgentProd agentProd) {
        AgentProdDto agentProdDto = new AgentProdDto();
        agentProdDto.setAgentRef(agentProd.getAgentRef());
        agentProdDto.setAgentManagerReference(agentProd.getAgentManagerReference());
        return agentProdDto;
    }

    @Override
    public AgentProd toEntity(AgentProdDto agentProdDto) {
        AgentProd agentProd = new AgentProd();
        agentProd.setAgentRef(agentProdDto.getAgentRef());
        agentProd.setAgentManagerReference(agentProdDto.getAgentManagerReference());
        return agentProd;
    }

    @Override
    public List<AgentProdDto> toDtoList(List<AgentProd> agentProds) {
        return agentProds.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<AgentProd> toEntityList(List<AgentProdDto> agentProdDtos) {
        return agentProdDtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
