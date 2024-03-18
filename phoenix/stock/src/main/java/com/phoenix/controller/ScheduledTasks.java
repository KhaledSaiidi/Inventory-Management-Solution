package com.phoenix.controller;

import com.phoenix.dto.ReclamationDto;
import com.phoenix.dto.StockEvent;
import com.phoenix.kafka.StockProducer;
import com.phoenix.model.Product;
import com.phoenix.repository.IUncheckHistoryRepository;
import com.phoenix.services.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ScheduledTasks {

    @Autowired
    private IProductService iProductService;
    @Autowired
    private StockProducer stockProducer;

    //@Scheduled(cron = "0 0 9 * * *")
    @Scheduled(cron = "0 * * * * *")
    public void checkProductsDueDate() {
        List<ReclamationDto> reclamationDtos = iProductService.getProductsForAlert();
        if(!reclamationDtos.isEmpty()){
            StockEvent stockEvent = new StockEvent();
            stockEvent.setReclamationDtos(reclamationDtos);
            stockProducer.sendMessage(stockEvent);

        }
    }

}
