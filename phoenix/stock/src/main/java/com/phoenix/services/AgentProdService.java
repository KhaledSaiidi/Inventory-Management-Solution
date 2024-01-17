package com.phoenix.services;

import com.phoenix.mapper.IAgentProdMapper;
import com.phoenix.repository.IAgentProdRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AgentProdService implements IAgentProdService{
    @Autowired
    private IAgentProdMapper iAgentProdMapper;

    @Autowired
    private IAgentProdRepository iAgentProdRepository;


}
