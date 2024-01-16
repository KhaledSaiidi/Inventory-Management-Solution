package com.phoenix.mapper;

import com.phoenix.dto.ReclamationDto;
import com.phoenix.model.Reclamation;

import java.util.List;

public interface IReclamationMapper {
    ReclamationDto toDto(Reclamation reclamation);
    Reclamation toEntity(ReclamationDto reclamationDto);
    List<ReclamationDto> toDtoList(List<Reclamation> reclamations);
    List<Reclamation> toEntityList(List<ReclamationDto> reclamationDtos);
}
