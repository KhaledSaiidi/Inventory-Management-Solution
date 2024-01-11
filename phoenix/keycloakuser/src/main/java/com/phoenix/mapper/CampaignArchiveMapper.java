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
    @Override
    public Campaigndto mapCampaignArchiveToCampaigndto(CampaignArchive campaignArchive) {
        Campaigndto campaigndto = new Campaigndto();
        campaigndto.setReference(campaignArchive.getReference());
        campaigndto.setCampaignName(campaignArchive.getCampaignName());
        campaigndto.setProducts(campaignArchive.getProducts());
        campaigndto.setStartDate(campaignArchive.getStartDate());
        campaigndto.setCampaignDescription(campaignArchive.getCampaignDescription());
        return campaigndto;
    }

}
