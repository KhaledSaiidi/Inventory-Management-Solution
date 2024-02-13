 package com.phoenix.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import java.net.ServerSocket;
import java.io.IOException;

@Configuration
@Slf4j
public class CustomPortConfiguration implements WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> {
    @Value("${MIN_PORT}")
    private Integer minPort;
    @Value("${MAX_PORT}")
    private Integer maxPort;
    @Value("${server.port}")
    private String initialServerPort;
    @Override
    public void customize(ConfigurableServletWebServerFactory factory) {
        if (initialServerPort.equals("0")) {
            log.info("Port is 0, let's assign a dynamic port..");
            int availablePort = findAvailablePort();
            factory.setPort(availablePort);
            System.getProperties().put("server.port", availablePort);
        }
    }
    private int findAvailablePort() {
        for (int port = minPort; port <= maxPort; port++) {
            try (ServerSocket socket = new ServerSocket(port)) {
                return port;
            } catch (IOException e) {
                log.warn("Port " + port + " is already in use.", e);
            }
        }
        throw new IllegalStateException("No available port found within the specified range");
    }
}