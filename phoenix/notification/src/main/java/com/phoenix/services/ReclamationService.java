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
import java.util.ArrayList;
import java.util.Comparator;
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
        addReclamations();
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
    public List<ReclamationDto> get30NewestReclamationsforReceiver(List<String> receiverReference) {
        List<Reclamation> reclamations = iReclamationRepository.findByReceiverReferenceContaining(receiverReference);
        List<ReclamationDto> reclamationDtos = iReclamationMapper.toDtoList(reclamations);
        reclamationDtos.sort(Comparator.comparing(ReclamationDto::getReclamDate).reversed());
        int limit = Math.min(reclamationDtos.size(), 30);
        reclamationDtos = reclamationDtos.subList(0, limit);
        return reclamationDtos;
    }

    public List<ReclamationDto>  getBody() {
        StockEvent event = notificationConsumer.latestEvent;
        List<ReclamationDto> reclamationDtos = new ArrayList<>();
        if (event != null) {
            reclamationDtos = event.getReclamationDtos();
            System.out.println("Heyyyy works!!" + reclamationDtos);
        }
        return reclamationDtos;
    }

    public void addReclamations() {
        StockEvent event = notificationConsumer.latestEvent;
        if (event != null) {
            List<ReclamationDto> reclamationDtos = event.getReclamationDtos();
            LocalDateTime now = LocalDateTime.now();
            reclamationDtos.forEach(dto -> dto.setReclamDate(now));
            List<Reclamation> reclamations = iReclamationMapper.toEntityList(reclamationDtos);
            iReclamationRepository.saveAll(reclamations);
            notifyFrontend();
        }
    }
}
