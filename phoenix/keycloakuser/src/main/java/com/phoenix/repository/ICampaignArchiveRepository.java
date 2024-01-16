package com.phoenix.repository;

import com.phoenix.model.Campaign;
import com.phoenix.model.CampaignArchive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ICampaignArchiveRepository extends JpaRepository<CampaignArchive, String> {
    Optional<CampaignArchive> findByReference(String reference);

}
