package com.phoenix.services;

import com.phoenix.dto.ReclamationDto;

import java.util.List;

public interface IReclamationService {

    void addReclamation(ReclamationDto reclamationDto);
    List<ReclamationDto> getReclamations();
}