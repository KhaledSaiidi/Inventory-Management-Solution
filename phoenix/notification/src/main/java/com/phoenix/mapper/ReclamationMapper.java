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
        reclamationDto.setSerialNumberOfSolddProduct(reclamation.getSerialNumberOfSolddProduct());
        reclamationDto.setSoldDate(reclamation.getSoldDate());
        reclamationDto.setSerialNumberOfReturnedProduct(reclamation.getSerialNumberOfReturnedProduct());
        reclamationDto.setReturnedDate(reclamation.getReturnedDate());
        reclamationDto.setExpirationDate(reclamation.getExpirationDate());

        reclamationDto.setQuantityToAdd(reclamation.getQuantityToAdd());
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
        reclamation.setSerialNumberOfSolddProduct(reclamationDto.getSerialNumberOfSolddProduct());
        reclamation.setSoldDate(reclamationDto.getSoldDate());
        reclamation.setSerialNumberOfReturnedProduct(reclamationDto.getSerialNumberOfReturnedProduct());
        reclamation.setReturnedDate(reclamationDto.getReturnedDate());
        reclamation.setExpirationDate(reclamationDto.getExpirationDate());
        reclamation.setQuantityToAdd(reclamationDto.getQuantityToAdd());
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
