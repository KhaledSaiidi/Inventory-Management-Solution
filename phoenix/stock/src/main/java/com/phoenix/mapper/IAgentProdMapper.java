package com.phoenix.mapper;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.model.AgentProd;

import java.util.List;

public interface IAgentProdMapper {
    AgentProdDto toDto(AgentProd agentProd);
    AgentProd toEntity(AgentProdDto agentProdDto);
    List<AgentProdDto> toDtoList(List<AgentProd> agentProds);
    List<AgentProd> toEntityList(List<AgentProdDto> agentProdDtos);
}
