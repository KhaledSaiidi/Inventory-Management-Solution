package com.phoenix.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class WebSocketService {
 @Autowired
 private final SimpMessagingTemplate messagingTemplate;

 public void sendMessage(final String topicSuffix) {
     messagingTemplate.convertAndSend("/topic/" + topicSuffix, "Default message from our WS service");
 }

}
