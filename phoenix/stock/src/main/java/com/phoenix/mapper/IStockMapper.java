package com.phoenix.mapper;

import com.phoenix.dto.StockDto;
import com.phoenix.model.Stock;

import java.util.List;

public interface IStockMapper {
    StockDto toDto(Stock stock);
    Stock toEntity(StockDto stockDto);
    List<StockDto> toDtoList(List<Stock> stocks);
    List<Stock> toEntityList(List<StockDto> stockDtos);
}
