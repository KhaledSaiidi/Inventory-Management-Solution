package com.phoenix.services;

import com.phoenix.dto.StockDto;
import com.phoenix.model.UncheckHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface IStockService {
    void addStock(StockDto stockDto, String campaignReference);
    Page<StockDto> getStocks(Pageable pageable);
    StockDto getstockByReference(String reference);
    List<UncheckHistory> getUncheckedHistorybyStockreference (String reference);
    StockDto UpdateStock(String reference, StockDto stockDto);
    List<StockDto> getStocksByCampaignRef(String campaignreference);
}
