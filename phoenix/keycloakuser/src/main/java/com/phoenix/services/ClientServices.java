package com.phoenix.services;

import com.phoenix.dto.Campaigndto;
import com.phoenix.dto.Clientdto;
import com.phoenix.dto.Userdto;
import com.phoenix.mapper.IClientMapper;
import com.phoenix.model.Campaign;
import com.phoenix.model.Client;
import com.phoenix.model.UserMysql;
import com.phoenix.repository.IClientRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    @Override
    public Clientdto getClientByName(String clientName) {
        Optional<Client> optionalClient = iclientRepository.findByCompanyName(clientName);

        if (optionalClient.isPresent()) {
            Client client = optionalClient.get();
            Clientdto clientdto = iclientMapper.mapClientToClientdto(client);
            return clientdto;
        } else {
            throw new EntityNotFoundException("Client not found with name: " + clientName);
        }
    }


    @Override
    public Clientdto UpdateClient(String reference, Clientdto clientdto) {
        Client client = iclientRepository.findByReference(reference).orElse(null);
        if (client == null) {return null;}
        if (clientdto.getCompanyName() != null) {
            client.setCompanyName(clientdto.getCompanyName());}
        if (clientdto.getCompanyemail() != null) {
            client.setCompanyemail(clientdto.getCompanyemail());}
        if (clientdto.getCompanyphone() != null) {
            client.setCompanyphone(clientdto.getCompanyphone());}
        if(clientdto.getReferentfirstName() != null){
            client.setReferentfirstName(clientdto.getReferentfirstName());}
        if (clientdto.getReferentlastName() != null) {
            client.setReferentlastName(clientdto.getReferentlastName());}
        if (clientdto.getReferentemail() != null) {
            client.setReferentemail(clientdto.getReferentemail());}
        if (clientdto.getReferentphone() != null) {
            client.setReferentphone(clientdto.getReferentphone());}
        Client savedclient = iclientRepository.save(client);
        return clientdto;
    }



}
