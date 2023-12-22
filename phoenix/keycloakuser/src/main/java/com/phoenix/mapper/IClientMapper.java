package com.phoenix.mapper;

import com.phoenix.dto.Clientdto;
import com.phoenix.model.Client;

import java.util.List;

public interface IClientMapper {
    Clientdto mapClientToClientdto(Client client);
    List<Clientdto> mapClientsToClientdtos(List<Client> clients);
    Client mapClientdtoToClient(Clientdto clientdto);
    List<Client> mapClientdtosToClients(List<Clientdto> clientdtos);
}
