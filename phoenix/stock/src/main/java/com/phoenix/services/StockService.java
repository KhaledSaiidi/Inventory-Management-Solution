package com.phoenix.services;

import com.phoenix.dto.ProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.dtokeycloakuser.Campaigndto;
import com.phoenix.mapper.IProductMapper;
import com.phoenix.mapper.IStockMapper;
import com.phoenix.model.Product;
import com.phoenix.model.Stock;
import com.phoenix.repository.IStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
}
