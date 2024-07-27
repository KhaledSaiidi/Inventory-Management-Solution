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
    //@Scheduled(cron = "0 */10 * * * *") // test Runs each 10 minutes
    @Scheduled(cron = "0 0 7 * * *") // Runs at 7:00 AM every day
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


    //@Scheduled(fixedRate = 600000) // test Runs each 10 min
    @Scheduled(cron = "0 30 23 * * *") // Runs at 11:30 PM every day
    public void deleteAgentProdsWithoutProducts() {
        iAgentProdService.deleteAgentProdsWithoutProducts();
    }
}
