package com.phoenix.services;

import com.phoenix.dto.Campaigndto;
import com.phoenix.dto.Clientdto;
import com.phoenix.mapper.ICampaignMapper;
import com.phoenix.model.Campaign;
import com.phoenix.model.Client;
import com.phoenix.repository.ICampaignRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CampaignServices implements ICampaignServices{

    @Autowired
    private ICampaignMapper iCampaignMapper;

    @Autowired
    private ICampaignRepository iCampaignRepository;

    @Override
    public void addCampaign(Campaigndto campaigndto) {
        Campaign campaign = iCampaignMapper.mapCampaigndtoToCampaign(campaigndto);
        iCampaignRepository.save(campaign);
    }
    @Override
    public List<Campaigndto> getCampaigns(){
        List<Campaign> campaigns = iCampaignRepository.findAll();
        List<Campaigndto> campaignsdto = iCampaignMapper.mapCampaignsToCampaigndtos(campaigns);
        return campaignsdto;
    }

}
