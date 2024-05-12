package com.phoenix.controller;

import com.phoenix.dto.ReclamationDto;
import com.phoenix.dto.StockEvent;
import com.phoenix.kafka.StockProducer;
import com.phoenix.model.Product;
import com.phoenix.repository.IUncheckHistoryRepository;
import com.phoenix.services.IAgentProdService;
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

    private final IProductService iProductService;
    @Autowired
    private StockProducer stockProducer;

    private final IAgentProdService iAgentProdService;
    //@Scheduled(cron = "0 0 0 * * MON")
    @Scheduled(cron = "0 */5 * * * *")
    public void checkProductsDueDate() {
        List<ReclamationDto> reclamationDtos = iProductService.getProductsForAlert();
        System.out.println("triggered");
        if(!reclamationDtos.isEmpty()){
            System.out.println(reclamationDtos);
            StockEvent stockEvent = new StockEvent();
            stockEvent.setReclamationDtos(reclamationDtos);
            stockProducer.sendMessage(stockEvent);

        }
    }


    //@Scheduled(fixedRate = 60000) // to test
    @Scheduled(cron = "0 0 23 * * SAT")
    public void deleteAgentProdsWithoutProducts() {
        iAgentProdService.deleteAgentProdsWithoutProducts();
    }
}
