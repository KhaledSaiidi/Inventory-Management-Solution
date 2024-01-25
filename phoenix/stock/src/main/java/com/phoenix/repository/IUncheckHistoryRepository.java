package com.phoenix.repository;

import com.phoenix.model.UncheckHistory;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IUncheckHistoryRepository extends JpaRepository<UncheckHistory, Long> {
    @Transactional
    void deleteByCheckDateBefore(LocalDate cutoffDate);
}
