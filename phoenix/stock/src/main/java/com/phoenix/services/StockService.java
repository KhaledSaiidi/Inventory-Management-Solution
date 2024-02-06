package com.phoenix.services;

import com.phoenix.dto.ProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.dtokeycloakuser.Campaigndto;
import com.phoenix.mapper.IProductMapper;
import com.phoenix.mapper.IStockMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import com.phoenix.model.Stock;
import com.phoenix.model.UncheckHistory;
import com.phoenix.repository.IStockRepository;
import com.phoenix.repository.IUncheckHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

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
        stockDto.setDueDate(stockDto.getReceivedDate().plusDays(45));
        }
        Stock stock = iStockMapper.toEntity(stockDto);
        iStockRepository.save(stock);

    }

    @Override
    public Page<StockDto> getStocks(String searchTerm,Pageable pageable) {
            Page<Stock> stocks = iStockRepository.findAll(pageable);
            List<StockDto> stockDtos = iStockMapper.toDtoList(stocks.getContent());

            for (StockDto stockdto : stockDtos) {
                Campaigndto campaignDto = webClientBuilder.build().get()
                        .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", stockdto.getCampaignRef())
                        .retrieve()
                        .bodyToMono(Campaigndto.class)
                        .block();
                stockdto.setCampaigndto(campaignDto);
            }
        if(searchTerm.isEmpty()) {
            return new PageImpl<>(stockDtos, pageable, stocks.getTotalElements());
        } else {
            return filterStocks(stockDtos, searchTerm, pageable);
        }
    }
    private Page<StockDto> filterStocks(List<StockDto> stockDtos, String searchTerm, Pageable pageable) {
        List<StockDto> filteredStocks = stockDtos.stream()
                .filter(stockDto -> filterBySearchTerm(stockDto, searchTerm))
                .collect(Collectors.toList());
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredStocks.size());
        Page<StockDto> page = new PageImpl<>(filteredStocks.subList(start, end), pageable, filteredStocks.size());
        return page;
    }
    private boolean filterBySearchTerm(StockDto stockDto, String searchTerm) {
        String searchString = searchTerm.toLowerCase();
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String shippingDate = stockDto.getShippingDate() != null ? stockDto.getShippingDate().format(dateFormatter) : "";
        String receivedDate = stockDto.getReceivedDate() != null ? stockDto.getReceivedDate().format(dateFormatter) : "";
        String dueDate = stockDto.getDueDate() != null ? stockDto.getDueDate().format(dateFormatter) : "";

        return stockDto.getStockReference().toLowerCase().contains(searchString)
                || stockDto.getCampaigndto().getCampaignName().toLowerCase().contains(searchString)
                || stockDto.getCampaigndto().getClient().getCompanyName().toLowerCase().contains(searchString)
                || shippingDate.contains(searchString)
                || receivedDate.contains(searchString)
                || dueDate.contains(searchString);
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
        Collections.sort(uncheckHistories, Comparator.comparing(UncheckHistory::getCheckDate).reversed());
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
        if (stockDto.getProducts() != null) {
            stock.setProductTypes(stockDto.getProductTypes());}

        if (stockDto.getShippingDate() != null) {
            stock.setShippingDate(stockDto.getShippingDate());}

        if (stockDto.getReceivedDate() != null) {
            stock.setReceivedDate(stockDto.getReceivedDate());
            stock.setDueDate(stockDto.getReceivedDate().plusDays(45));
        }
        if (stockDto.isChecked()) {
            stock.setChecked(stockDto.isChecked());}
        if (stockDto.getNotes() != null) {
            stock.setNotes(stockDto.getNotes());}
        iStockRepository.save(stock);
        return stockDto;
    }

    @Override
    public List<StockDto> getStocksByCampaignRef(String campaignreference) {
        Optional<List<Stock>> optionalstocks = iStockRepository.findByCampaignRef(campaignreference);
        if(optionalstocks.isPresent()) {
            List<Stock> stocks = optionalstocks.get();
            List<StockDto> stocksdto =  iStockMapper.toDtoList(stocks);
            return stocksdto;
        } else {
            return null;
        }
    }
}
