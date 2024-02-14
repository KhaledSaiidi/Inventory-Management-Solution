package com.phoenix.mapper;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.model.AgentProd;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AgentProdMapper implements IAgentProdMapper{
    @Override
    public AgentProdDto toDto(AgentProd agentProd) {
        AgentProdDto agentProdDto = new AgentProdDto();
        agentProdDto.setAgentRef(agentProd.getAgentRef());
        agentProdDto.setUsername(agentProd.getUsername());
        agentProdDto.setFirstname(agentProd.getFirstname());
        agentProdDto.setLastname(agentProd.getLastname());
        agentProdDto.setAffectaiondate(agentProd.getAffectaiondate());
        agentProdDto.setDuesoldDate(agentProd.getDuesoldDate());
        agentProdDto.setReceivedDate(agentProd.getReceivedDate());
        agentProdDto.setSeniorAdvisor(agentProd.isSeniorAdvisor());
        return agentProdDto;
    }

    @Override
    public AgentProd toEntity(AgentProdDto agentProdDto) {
        AgentProd agentProd = new AgentProd();
        agentProd.setAgentRef(agentProdDto.getAgentRef());
        agentProd.setUsername(agentProdDto.getUsername());
        agentProd.setFirstname(agentProdDto.getFirstname());
        agentProd.setLastname(agentProdDto.getLastname());
        agentProd.setAffectaiondate(agentProdDto.getAffectaiondate());
        agentProd.setDuesoldDate(agentProdDto.getDuesoldDate());
        agentProd.setReceivedDate(agentProdDto.getReceivedDate());
        agentProd.setSeniorAdvisor(agentProdDto.isSeniorAdvisor());

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
