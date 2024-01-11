package com.phoenix.mapper;

import com.phoenix.dto.Campaigndto;
import com.phoenix.model.Campaign;
import com.phoenix.model.CampaignArchive;
import org.springframework.stereotype.Service;

@Service
public class CampaignArchiveMapper implements ICampaignArchiveMapper{

    @Override
    public CampaignArchive mapCampaignToCampaignArchive(Campaign campaign){
        CampaignArchive campaignArchive = new CampaignArchive();
        campaignArchive.setReference(campaign.getReference());
        campaignArchive.setCampaignName(campaign.getCampaignName());
        campaignArchive.setProducts(campaign.getProducts());
        campaignArchive.setStartDate(campaign.getStartDate());
        campaignArchive.setCampaignDescription(campaign.getCampaignDescription());
        campaignArchive.setClient(campaign.getClient());
        return campaignArchive;
    }

}
