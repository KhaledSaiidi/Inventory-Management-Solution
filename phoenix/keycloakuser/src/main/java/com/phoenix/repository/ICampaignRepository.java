package com.phoenix.repository;

import com.phoenix.model.Campaign;
import com.phoenix.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICampaignRepository extends JpaRepository<Campaign, String> {
    Optional<Campaign> findByReference(String reference);


    @Query("SELECT COUNT(cp) FROM Campaign cp WHERE YEAR(cp.startDate) = YEAR(CURRENT_DATE)")
    long countCampaignsCurrentYear();
    @Query("SELECT COUNT(cp) FROM Campaign cp WHERE YEAR(cp.startDate) = YEAR(CURRENT_DATE) - 1")
    long countCampaignsPreviousMonth();


}
