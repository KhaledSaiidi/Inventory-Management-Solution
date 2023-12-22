package com.phoenix.mapper;

import com.phoenix.dto.Campaigndto;
import com.phoenix.model.Campaign;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CampaignMapper implements ICampaignMapper{

    @Override
    public Campaigndto mapCampaignToCampaigndto(Campaign campaign) {
        Campaigndto campaigndto = new Campaigndto();
        campaigndto.setReference(campaign.getReference());
        campaigndto.setCampaignName(campaign.getCampaignName());
        campaigndto.setProducts(campaign.getProducts());
        campaigndto.setStartDate(campaign.getStartDate());
        campaigndto.setCampaignDescription(campaign.getCampaignDescription());
        // Assuming ClientMapper has a similar manual mapping method
        return campaigndto;
    }

    @Override
    public List<Campaigndto> mapCampaignsToCampaigndtos(List<Campaign> campaigns) {
        return campaigns.stream()
                .map(this::mapCampaignToCampaigndto)
                .collect(Collectors.toList());
    }
    @Override
    public Campaign mapCampaigndtoToCampaign(Campaigndto campaigndto) {
        Campaign campaign = new Campaign();
        campaign.setReference(campaigndto.getReference());
        campaign.setCampaignName(campaigndto.getCampaignName());
        campaign.setProducts(campaigndto.getProducts());
        campaign.setStartDate(campaigndto.getStartDate());
        campaign.setCampaignDescription(campaigndto.getCampaignDescription());
        return campaign;
    }
    @Override
    public List<Campaign> mapCampaigndtosToCampaigns(List<Campaigndto> campaigndtos) {
        return campaigndtos.stream()
                .map(this::mapCampaigndtoToCampaign)
                .collect(Collectors.toList());
    }

}
