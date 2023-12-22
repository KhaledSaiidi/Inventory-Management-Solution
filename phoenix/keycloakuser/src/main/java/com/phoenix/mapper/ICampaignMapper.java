package com.phoenix.mapper;

import com.phoenix.dto.Campaigndto;
import com.phoenix.dto.Clientdto;
import com.phoenix.model.Campaign;
import com.phoenix.model.Client;

import java.util.List;

public interface ICampaignMapper {
    Campaigndto mapCampaignToCampaigndto(Campaign campaign);
    List<Campaigndto> mapCampaignsToCampaigndtos(List<Campaign> campaigns);
    Campaign mapCampaigndtoToCampaign(Campaigndto campaigndto);
    List<Campaign> mapCampaigndtosToCampaigns(List<Campaigndto> campaigndtos);

}
