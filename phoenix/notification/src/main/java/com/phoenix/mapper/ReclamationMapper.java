package com.phoenix.mapper;

import com.phoenix.dto.ReclamationDto;
import com.phoenix.model.ReclamType;
import com.phoenix.model.Reclamation;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReclamationMapper implements IReclamationMapper {
    @Override
    public ReclamationDto toDto(Reclamation reclamation) {
        ReclamationDto reclamationDto = new ReclamationDto();
        reclamationDto.setId(reclamation.getId());
        reclamationDto.setReclamationType(reclamation.getReclamationType());
        reclamationDto.setReclamationText(reclamation.getReclamationText());
        reclamationDto.setSenderReference(reclamation.getSenderReference());

        reclamationDto.setReceiverReference(reclamation.getReceiverReference());
        reclamationDto.setVuedreceivers(reclamation.getVuedreceivers());
        reclamationDto.setReclamDate(reclamation.getReclamDate());
        return reclamationDto;
    }
    @Override
    public Reclamation toEntity(ReclamationDto reclamationDto) {
        Reclamation reclamation = new Reclamation();
        reclamation.setId(reclamationDto.getId());
        reclamation.setReclamationType(reclamationDto.getReclamationType());
        reclamation.setReclamationText(reclamationDto.getReclamationText());
        reclamation.setSenderReference(reclamationDto.getSenderReference());
        reclamation.setReceiverReference(reclamationDto.getReceiverReference());
        reclamation.setVuedreceivers(reclamationDto.getVuedreceivers());
        reclamation.setReclamDate(reclamationDto.getReclamDate());
        return reclamation;
    }
    @Override
    public List<ReclamationDto> toDtoList(List<Reclamation> reclamations) {
        return reclamations.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<Reclamation> toEntityList(List<ReclamationDto> reclamationDtos) {
        return reclamationDtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }

}
