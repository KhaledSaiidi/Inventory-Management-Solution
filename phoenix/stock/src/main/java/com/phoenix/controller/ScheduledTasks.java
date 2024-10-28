package com.phoenix.controller;

import com.phoenix.dto.ReclamationDto;
import com.phoenix.dto.StockEvent;
import com.phoenix.kafka.StockProducer;
import com.phoenix.services.IAgentProdService;
import com.phoenix.services.IProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledTasks {

    private final IProductService iProductService;
    @Autowired
    private StockProducer stockProducer;

    private final IAgentProdService iAgentProdService;
    @Scheduled(fixedRate = 86400000) // 24 hours in milliseconds
    public void checkProductsDueDate() {
        log.info("checkProductsDueDate Triggered");
        List<ReclamationDto> reclamationDtos = new ArrayList<>();
        try {
            reclamationDtos = iProductService.getProductsForAlert();
        } catch (Exception e) {
            log.error("Error fetching products for alert: ", e);
            return; // Exit if there's an error fetching products
        }
        if(!reclamationDtos.isEmpty()){
            StockEvent stockEvent = new StockEvent();
            stockEvent.setReclamationDtos(reclamationDtos);
            try {
                stockProducer.sendMessage(stockEvent);
                log.info("checkProductsDueDate Finished successfully, sent {} reclamations", reclamationDtos.size());
            } catch (Exception e) {
                log.error("Error sending stock event: ", e);
            }
        } else {
            log.warn("No reclamation DTOs found to send.");
        }
    }


    @Scheduled(fixedRate = 172800000) // 48 hours in milliseconds
    public void deleteAgentProdsWithoutProducts() {
        iAgentProdService.deleteAgentProdsWithoutProducts();
    }
}
