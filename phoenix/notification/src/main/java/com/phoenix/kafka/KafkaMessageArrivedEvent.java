package com.phoenix.kafka;

import org.springframework.context.ApplicationEvent;

public class KafkaMessageArrivedEvent extends ApplicationEvent {
    public KafkaMessageArrivedEvent(Object source) {
        super(source);
    }
}
