 package com.phoenix.kafka;


 import com.phoenix.dto.StockEvent;
 import org.slf4j.LoggerFactory;
 import org.springframework.kafka.annotation.KafkaListener;
 import org.springframework.stereotype.Service;
 import org.slf4j.Logger;

 @Service
public class NotificationConsumer {

    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationConsumer.class);

    @KafkaListener(
            topics = "${spring.kafka.topic.name}",
            groupId = "${spring.kafka.consumer.group-id}")
    public void consume(StockEvent event){
        LOGGER.info(String.format("Notification event received in notification microservice => %s", event.toString()));
    }
}
