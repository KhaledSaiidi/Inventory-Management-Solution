package com.phoenix.controller;

import com.phoenix.services.IReclamationService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ScheduledTasks {

    private final IReclamationService iReclamationService;
    @Scheduled(cron = "0 45 23 * * *") // Runs at 11:45 PM every day
    public void deleteOldMatchingReclamations() {
        iReclamationService.deleteOldMatchingReclamations();
    }
}
