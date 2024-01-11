package com.phoenix.repository;

import com.phoenix.model.Campaign;
import com.phoenix.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICampaignRepository extends JpaRepository<Campaign, String> {
    Optional<Campaign> findByReference(String reference);

}
