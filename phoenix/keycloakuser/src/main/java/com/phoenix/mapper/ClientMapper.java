package com.phoenix.mapper;

import com.phoenix.dto.Clientdto;
import com.phoenix.model.Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientMapper implements IClientMapper {


    @Override
    public  Clientdto mapClientToClientdto(Client client) {
        Clientdto clientdto = new Clientdto();
        clientdto.setReference(client.getReference());
        clientdto.setCompanyName(client.getCompanyName());
        clientdto.setCompanyemail(client.getCompanyemail());
        clientdto.setCompanyphone(client.getCompanyphone());
        clientdto.setReferentfirstName(client.getReferentfirstName());
        clientdto.setReferentlastName(client.getReferentlastName());
        clientdto.setReferentemail(client.getReferentemail());
        clientdto.setReferentphone(client.getReferentphone());
        return clientdto;
    }

    @Override
    public  List<Clientdto> mapClientsToClientdtos(List<Client> clients) {
        return clients.stream()
                .map(this::mapClientToClientdto)
                .collect(Collectors.toList());
    }

    // POST functions
    @Override
    public  Client mapClientdtoToClient(Clientdto clientdto) {
        Client client = new Client();
        client.setCompanyName(clientdto.getCompanyName());
        client.setCompanyemail(clientdto.getCompanyemail());
        client.setCompanyphone(clientdto.getCompanyphone());
        client.setReferentfirstName(clientdto.getReferentfirstName());
        client.setReferentlastName(clientdto.getReferentlastName());
        client.setReferentemail(clientdto.getReferentemail());
        client.setReferentphone(clientdto.getReferentphone());
        return client;
    }

    @Override
    public  List<Client> mapClientdtosToClients(List<Clientdto> clientdtos) {
        return clientdtos.stream()
                .map(this::mapClientdtoToClient)
                .collect(Collectors.toList());
    }


}
