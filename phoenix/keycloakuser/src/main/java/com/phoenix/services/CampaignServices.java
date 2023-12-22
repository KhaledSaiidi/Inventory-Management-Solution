package com.phoenix.services;

import com.phoenix.dto.Campaigndto;
import com.phoenix.dto.Clientdto;
import com.phoenix.mapper.ICampaignMapper;
import com.phoenix.mapper.IClientMapper;
import com.phoenix.model.Campaign;
import com.phoenix.model.Client;
import com.phoenix.repository.ICampaignRepository;
import com.phoenix.repository.IClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CampaignServices implements ICampaignServices{

    @Autowired
    private ICampaignMapper iCampaignMapper;
    @Autowired
    private IClientMapper iClientMapper;

    @Autowired
    private ICampaignRepository iCampaignRepository;
    @Autowired
    private IClientRepository iClientRepository;

    @Override
    public void addCampaign(Campaigndto campaigndto) {
        Campaign campaign = iCampaignMapper.mapCampaigndtoToCampaign(campaigndto);
        String reference = campaigndto.getClient().getReference();
        Optional<Client> optionalClient = iClientRepository.findByReference(reference);
        Client client = optionalClient.orElse(null);
        campaign.setClient(client);
        iCampaignRepository.save(campaign);
    }
    @Override
    public List<Campaigndto> getCampaigns(){
        List<Campaign> campaigns = iCampaignRepository.findAll();
        List<Campaigndto> campaignsdto = new ArrayList<>();
        if(!campaigns.isEmpty()) {
        for (Campaign campaign: campaigns) {
            Clientdto clientdto = iClientMapper.mapClientToClientdto(campaign.getClient());
            Campaigndto campaigndto = iCampaignMapper.mapCampaignToCampaigndto(campaign);
            campaigndto.setClient(clientdto);
            campaignsdto.add(campaigndto);
            }
        }
        return campaignsdto;
    }

}
