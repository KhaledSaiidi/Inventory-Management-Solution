package com.phoenix.services;

import com.phoenix.dto.ReclamationDto;
import com.phoenix.dto.StockEvent;
import com.phoenix.dtokeycloakuser.Campaigndto;
import com.phoenix.kafka.KafkaMessageArrivedEvent;
import com.phoenix.kafka.NotificationConsumer;
import com.phoenix.mapper.IReclamationMapper;
import com.phoenix.model.Reclamation;
import com.phoenix.repository.IReclamationRepository;
import com.phoenix.stockdto.StockDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReclamationService implements IReclamationService, ApplicationListener<KafkaMessageArrivedEvent> {

    @Autowired
    private IReclamationMapper iReclamationMapper;
    @Autowired
    private IReclamationRepository iReclamationRepository;

    @Autowired
    private WebSocketService webSocketService;

    @Autowired
    private NotificationConsumer notificationConsumer;

    @Override
    public void onApplicationEvent(KafkaMessageArrivedEvent event) {
        String productSerialNumber = getBody();
    }


    protected String getEntityTopic() {
        return "notification";
    }
    private void notifyFrontend(){
        final String entityTopic = getEntityTopic();
        if(entityTopic == null){
            log.error("Failed to get entity topic... !");
        }
        webSocketService.sendMessage(entityTopic);
    }

    @Override
    public void addReclamation(ReclamationDto reclamationDto) {
        LocalDateTime now = LocalDateTime.now();
        Reclamation reclamation = iReclamationMapper.toEntity(reclamationDto);
        reclamation.setReclamDate(now);
        iReclamationRepository.save(reclamation);
        notifyFrontend();
    }

    @Override
    public List<ReclamationDto> getReclamations() {
        List<Reclamation> reclamations = iReclamationRepository.findAll();
        return iReclamationMapper.toDtoList(reclamations);
    }

    public String  getBody() {
        StockEvent event = notificationConsumer.latestEvent;
        String productSerialNumber = "";
        if (event != null) {
            productSerialNumber = event.getBody();
            System.out.println("Heyyyy works!!" + productSerialNumber);
        }
        return productSerialNumber;
    }
}
