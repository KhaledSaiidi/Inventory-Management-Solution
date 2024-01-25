package com.phoenix.controller;

import com.phoenix.repository.IUncheckHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class ScheduledTasks {
    @Autowired
    private IUncheckHistoryRepository iUncheckHistoryRepository;
    @Scheduled(cron = "0 0 0 1 * *")
    public void deleteOldUncheckHistory() {
        LocalDate currentDate = LocalDate.now();
        LocalDate cutoffDate = currentDate.minusDays(60); // Records older than 60 days will be deleted
        iUncheckHistoryRepository.deleteByCheckDateBefore(cutoffDate);
        System.out.println("Deleted old UncheckHistory records.");
    }

}
