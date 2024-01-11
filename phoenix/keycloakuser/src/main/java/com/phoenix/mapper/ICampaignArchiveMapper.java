package com.phoenix.mapper;

import com.phoenix.dto.Campaigndto;
import com.phoenix.model.Campaign;
import com.phoenix.model.CampaignArchive;

public interface ICampaignArchiveMapper {
    CampaignArchive mapCampaignToCampaignArchive(Campaign campaign);
    Campaigndto mapCampaignArchiveToCampaigndto(CampaignArchive campaignArchive);
}
