package com.phoenix.repository;

import com.phoenix.model.CampaignArchive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ICampaignArchiveRepository extends JpaRepository<CampaignArchive, String> {
}
