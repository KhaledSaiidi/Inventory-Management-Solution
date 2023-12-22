package com.phoenix.repository;

import com.phoenix.model.Campaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICampaignRepository extends JpaRepository<Campaign, String> {
}
