package com.phoenix.kafka;

import com.phoenix.dto.StockEvent;
import lombok.AllArgsConstructor;
import org.apache.kafka.clients.admin.NewTopic;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class StockProducer {

    private static final Logger LOGGER = LoggerFactory.getLogger(StockProducer.class);
    private NewTopic topic;

    private KafkaTemplate<String, StockEvent> kafkaTemplate;

    public void sendMessage(StockEvent event){
        LOGGER.info(String.format("Stock event => %s", event.toString()));
        //Create a Message
        Message<StockEvent> message = MessageBuilder
                .withPayload(event)
                .setHeader(KafkaHeaders.TOPIC, topic.name())
                .build();
        kafkaTemplate.send(message);
    }
}
