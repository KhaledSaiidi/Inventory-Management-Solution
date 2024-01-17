package com.phoenix.services;

import com.phoenix.mapper.IReclamationMapper;
import com.phoenix.repository.IReclamationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReclamationService implements IReclamationService {

    @Autowired
    private IReclamationMapper iReclamationMapper;
    @Autowired
    private IReclamationRepository iReclamationRepository;

}
