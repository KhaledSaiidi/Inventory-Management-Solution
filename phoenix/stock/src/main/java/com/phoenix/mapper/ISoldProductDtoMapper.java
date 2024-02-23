package com.phoenix.mapper;

import com.phoenix.dto.SoldProductDto;
import com.phoenix.model.SoldProduct;

import java.util.List;

public interface ISoldProductDtoMapper {
    SoldProductDto toDto(SoldProduct soldProduct);
    SoldProduct toEntity(SoldProductDto soldProductDto);
    List<SoldProductDto> toDtoList(List<SoldProduct> soldProducts);
    List<SoldProduct> toEntityList(List<SoldProductDto> soldProductDtos);
}
