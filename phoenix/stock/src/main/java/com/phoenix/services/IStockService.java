package com.phoenix.services;

import com.phoenix.dto.StockDto;

import java.math.BigDecimal;
import java.util.List;

public interface IStockService {
    void addStock(StockDto stockDto, String campaignReference);
    List<StockDto> getstocks();
    StockDto getstockByReference(String reference);
}
