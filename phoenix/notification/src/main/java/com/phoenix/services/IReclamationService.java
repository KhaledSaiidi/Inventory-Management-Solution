package com.phoenix.services;

import com.phoenix.dto.ReclamationDto;

import java.util.List;

public interface IReclamationService {

    void addReclamation(ReclamationDto reclamationDto);
    List<ReclamationDto> get30NewestReclamationsforReceiver(String receiverReference);
    List<ReclamationDto> getAllReclamationsForReceiver(String receiverReference);
    List<ReclamationDto> getAllReclamationsForsender(String senderReference);
    void terminatenotif(String username, List<ReclamationDto> reclamationsnotSeen);

}
