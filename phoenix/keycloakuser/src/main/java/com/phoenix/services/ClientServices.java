package com.phoenix.services;

import com.phoenix.dto.Campaigndto;
import com.phoenix.dto.Clientdto;
import com.phoenix.mapper.IClientMapper;
import com.phoenix.model.Campaign;
import com.phoenix.model.Client;
import com.phoenix.repository.IClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServices implements IClientServices{
    @Autowired
    private IClientMapper iclientMapper;
    @Autowired
    private IClientRepository iclientRepository;

    @Override
    public void addClient(Clientdto clientdto) {
        Client client = iclientMapper.mapClientdtoToClient(clientdto);
        iclientRepository.save(client);
    }


    @Override
    public List<Clientdto> getClients(){
        List<Client> clients = iclientRepository.findAll();
        List<Clientdto> clientdtos = iclientMapper.mapClientsToClientdtos(clients);
        return clientdtos;
    }



}
