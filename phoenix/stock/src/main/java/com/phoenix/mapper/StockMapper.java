package com.phoenix.mapper;

import com.phoenix.dto.StockDto;
import com.phoenix.model.Stock;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StockMapper implements IStockMapper{
    @Override
    public StockDto toDto(Stock stock) {
        StockDto stockDto = new StockDto();
        stockDto.setStockReference(stock.getStockReference());
        stockDto.setProductTypes(stock.getProductTypes());
        stockDto.setCampaignRef(stock.getCampaignRef());
        stockDto.setShippingDate(stock.getShippingDate());
        stockDto.setReceivedDate(stock.getReceivedDate());
        stockDto.setDueDate(stock.getDueDate());
        stockDto.setChecked(stock.isChecked());
        stockDto.setNotes(stock.getNotes());
        stockDto.setStockValue(stock.getStockValue());
        return stockDto;
    }

    @Override
    public Stock toEntity(StockDto stockDto) {
        Stock stock = new Stock();
        stock.setStockReference(stockDto.getStockReference());
        stock.setProductTypes(stockDto.getProductTypes());
        stock.setCampaignRef(stockDto.getCampaignRef());
        stock.setShippingDate(stockDto.getShippingDate());
        stock.setReceivedDate(stockDto.getReceivedDate());
        stock.setDueDate(stockDto.getDueDate());
        stock.setChecked(stockDto.isChecked());
        stock.setNotes(stockDto.getNotes());
        stock.setStockValue(stockDto.getStockValue());
        return stock;
    }

    @Override
    public List<StockDto> toDtoList(List<Stock> stocks) {
        return stocks.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<Stock> toEntityList(List<StockDto> stockDtos) {
        return stockDtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }
}
