package com.phoenix.services;

import com.phoenix.dto.Campaigndto;
import com.phoenix.dto.Clientdto;

import java.util.List;

public interface IClientServices {
    void addClient(Clientdto clientdto);
    List<Clientdto> getClients();
    Clientdto getClientByName(String clientName);
    Clientdto UpdateClient(String reference, Clientdto clientdto);

}
