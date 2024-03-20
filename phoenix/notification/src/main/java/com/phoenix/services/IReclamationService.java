package com.phoenix.services;

import com.phoenix.dto.ReclamationDto;

import java.util.List;

public interface IReclamationService {

    void addReclamation(ReclamationDto reclamationDto);
    List<ReclamationDto> get30NewestReclamationsforReceiver(String receiverReference);
    List<ReclamationDto> getAll();
    void terminatenotif(String username, List<ReclamationDto> reclamationsnotSeen);

}
