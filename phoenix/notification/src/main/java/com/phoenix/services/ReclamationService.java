package com.phoenix.services;

import com.phoenix.dto.ReclamationDto;
import com.phoenix.dto.StockEvent;
import com.phoenix.kafka.KafkaMessageArrivedEvent;
import com.phoenix.kafka.NotificationConsumer;
import com.phoenix.mapper.IReclamationMapper;
import com.phoenix.model.Reclamation;
import com.phoenix.repository.IReclamationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

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
    public List<ReclamationDto> get30NewestReclamationsforReceiver(String receiverReference) {
        List<Reclamation> reclamationsRelated = iReclamationRepository.findAll()
                .stream()
                .filter(reclamation ->
                        reclamation.getReceiverReference().stream()
                                .map(String::toLowerCase)
                                .anyMatch(reference -> reference.contains(receiverReference.toLowerCase())))
                .collect(Collectors.toList());

        List<ReclamationDto> reclamationDtos = iReclamationMapper.toDtoList(reclamationsRelated);
        reclamationDtos.sort(Comparator.comparing(ReclamationDto::getReclamDate).reversed());
        int limit = Math.min(reclamationDtos.size(), 30);
        reclamationDtos = reclamationDtos.subList(0, limit);
        return reclamationDtos;
    }
    @Override
    public List<ReclamationDto> getAllReclamationsForReceiver(String receiverReference){
        List<Reclamation> reclamationsRelated = iReclamationRepository.findAll()
                .stream()
                .filter(reclamation ->
                        reclamation.getReceiverReference().stream()
                                .map(String::toLowerCase)
                                .anyMatch(reference -> reference.contains(receiverReference.toLowerCase())))
                .collect(Collectors.toList());
        List<ReclamationDto> reclamationDtos = iReclamationMapper.toDtoList(reclamationsRelated);
        reclamationDtos.sort(Comparator.comparing(ReclamationDto::getReclamDate).reversed());
        return reclamationDtos;
    }

    @Override
    public List<ReclamationDto> getAllReclamationsForsender(String senderReference){
        List<Reclamation> reclamationsRelated = iReclamationRepository.findAll()
                .stream()
                .filter(reclamation -> reclamation.getSenderReference().equalsIgnoreCase(senderReference.toLowerCase()))
                .collect(Collectors.toList());
        List<ReclamationDto> reclamationDtos = iReclamationMapper.toDtoList(reclamationsRelated);
        reclamationDtos.sort(Comparator.comparing(ReclamationDto::getReclamDate).reversed());
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

    @Override
    public void terminatenotif(String username, List<ReclamationDto> reclamationsnotSeen) {
        List<Reclamation> reclamations = iReclamationMapper.toEntityList(reclamationsnotSeen);
        for (Reclamation reclamation: reclamations){
            List<String> vuedPersons = reclamation.getVuedreceivers();
            if(vuedPersons == null){
                vuedPersons = new ArrayList<>();
            }
            vuedPersons.add(username.toLowerCase());
            reclamation.setVuedreceivers(vuedPersons);
        }
        iReclamationRepository.saveAll(reclamations);
    }


    @Override
    public void deleteOldMatchingReclamations() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
        List<Reclamation> oldReclamations = iReclamationRepository.findAllByReclamDateBefore(sevenDaysAgo);
        for (Reclamation reclamation : oldReclamations) {
            if (areListsEqualIgnoreCase(reclamation.getReceiverReference(), reclamation.getVuedreceivers())) {
                iReclamationRepository.delete(reclamation);
            }
        }
    }

    private boolean areListsEqualIgnoreCase(List<String> list1, List<String> list2) {
        if (list1 == null || list2 == null) {
            return false;
        }
        if (list1.size() != list2.size()) {
            return false;
        }
        List<String> sortedList1 = list1.stream()
                .map(str -> str.toLowerCase(Locale.ROOT))
                .sorted()
                .toList();
        List<String> sortedList2 = list2.stream()
                .map(str -> str.toLowerCase(Locale.ROOT))
                .sorted()
                .toList();
        return sortedList1.equals(sortedList2);
    }


}
