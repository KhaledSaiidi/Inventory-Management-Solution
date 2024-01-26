package com.phoenix.services;

import com.phoenix.dto.ProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.dtokeycloakuser.Campaigndto;
import com.phoenix.mapper.IProductMapper;
import com.phoenix.mapper.IStockMapper;
import com.phoenix.model.Product;
import com.phoenix.model.Stock;
import com.phoenix.model.UncheckHistory;
import com.phoenix.repository.IStockRepository;
import com.phoenix.repository.IUncheckHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.*;

@Service
@RequiredArgsConstructor
public class StockService implements IStockService{
    @Autowired
    private IStockMapper iStockMapper;
    @Autowired
    private IProductMapper iProductMapper;

    @Autowired
    private IStockRepository iStockRepository;

    private final WebClient.Builder webClientBuilder;
    @Autowired
    private IUncheckHistoryRepository iUncheckHistoryRepository;


    @Override
    public void addStock(StockDto stockDto, String campaignReference) {
       Campaigndto campaigndto =  webClientBuilder.build().get()
                                    .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", campaignReference)
                                    .retrieve()
                                    .bodyToMono(Campaigndto.class)
                                    .block();
        if (campaigndto != null) {
        stockDto.setCampaignRef(campaigndto.getReference());
        stockDto.setProductTypes(campaigndto.getProducts());
        }
        Stock stock = iStockMapper.toEntity(stockDto);
        iStockRepository.save(stock);

    }

    @Override
    public List<StockDto> getstocks() {
        List<Stock> stocks = iStockRepository.findAll();
        List<StockDto> stockDtos = iStockMapper.toDtoList(stocks);
        for (StockDto stockdto: stockDtos) {
            Campaigndto campaigndto =  webClientBuilder.build().get()
                    .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", stockdto.getCampaignRef())
                    .retrieve()
                    .bodyToMono(Campaigndto.class)
                    .block();
            stockdto.setCampaigndto(campaigndto);
        }
        return stockDtos;
    }

    @Override
    public StockDto getstockByReference(String reference) {
        Optional<Stock> stockOptional = iStockRepository.findById(reference);
        if (stockOptional.isEmpty()) {
            return null;
        }
        Stock stock = stockOptional.get();
        Campaigndto campaigndto = webClientBuilder.build().get()
                .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", stock.getCampaignRef())
                .retrieve()
                .bodyToMono(Campaigndto.class)
                .block();
        StockDto stockDto = iStockMapper.toDto(stock);
        stockDto.setCampaigndto(campaigndto);
        return stockDto;
    }

    @Override
    public List<UncheckHistory> getUncheckedHistorybyStockreference (String reference) {
        Optional<List<UncheckHistory>> optionaluncheckHistories= iUncheckHistoryRepository.findByStockreference(reference);
        if(optionaluncheckHistories.isEmpty()) {
            return null;
        }
        List<UncheckHistory> uncheckHistories = optionaluncheckHistories.get();
        Collections.sort(uncheckHistories, Comparator.comparing(UncheckHistory::getCheckDate));
        List<UncheckHistory> triByDateUncheckHistories = new ArrayList<>(uncheckHistories);
        return triByDateUncheckHistories;
    }

    @Override
    public StockDto UpdateStock(String reference, StockDto stockDto) {
        Stock stock = iStockRepository.findById(reference).orElse(null);
        if (stock == null) {
            return null;
        }
        if (stockDto.getCampaignRef() != null) {
            stock.setCampaignRef(stockDto.getCampaignRef());}
        if (stockDto.getStockDate() != null) {
            stock.setStockDate(stockDto.getStockDate());}
        if (stockDto.isChecked()) {
            stock.setChecked(stockDto.isChecked());}
        if (stockDto.getNotes() != null) {
            stock.setNotes(stockDto.getNotes());}
        iStockRepository.save(stock);
        return stockDto;
    }

}
