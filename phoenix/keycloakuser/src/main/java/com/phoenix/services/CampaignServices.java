package com.phoenix.services;

import com.phoenix.dto.Campaigndto;
import com.phoenix.dto.Clientdto;
import com.phoenix.mapper.ICampaignArchiveMapper;
import com.phoenix.mapper.ICampaignMapper;
import com.phoenix.mapper.IClientMapper;
import com.phoenix.model.Campaign;
import com.phoenix.model.CampaignArchive;
import com.phoenix.model.Client;
import com.phoenix.repository.ICampaignArchiveRepository;
import com.phoenix.repository.ICampaignRepository;
import com.phoenix.repository.IClientRepository;
import jakarta.persistence.EntityNotFoundException;
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
    private ICampaignArchiveRepository iCampaignArchiveRepository;
    @Autowired
    private IClientRepository iClientRepository;
    @Autowired
    private ICampaignArchiveMapper iCampaignArchiveMapper;

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

    @Override
    public Campaigndto UpdateCampaign(String reference, Campaigndto campaigndto) {
        Campaign campaign = iCampaignRepository.findByReference(reference).orElse(null);
        if (campaign == null) {return null;}
        if (campaigndto.getCampaignName() != null) {
            campaign.setCampaignName(campaigndto.getCampaignName());}
        if (campaigndto.getProducts() != null) {
            campaign.setProducts(campaigndto.getProducts());}
        if (campaigndto.getStartDate() != null) {
            campaign.setStartDate(campaigndto.getStartDate());}
        if(campaigndto.getCampaignDescription() != null){
            campaign.setCampaignDescription(campaigndto.getCampaignDescription());}
        if(campaigndto.getClient().getReference() != null){
            Optional<Client> optionalClient = iClientRepository.findByReference(campaigndto.getClient().getReference());
            Client client = optionalClient.orElse(null);
            campaign.setClient(client);}
        Campaign savedcampaign = iCampaignRepository.save(campaign);
        return campaigndto;
    }

    @Override
    public Campaigndto getCampaignByReference(String reference) {
        Optional<Campaign> optionalCampaign = iCampaignRepository.findByReference(reference);
        if (optionalCampaign.isPresent()) {
            Campaign campaign = optionalCampaign.get();
            Campaigndto campaigndto = iCampaignMapper.mapCampaignToCampaigndto(campaign);
            Clientdto clientdto = iClientMapper.mapClientToClientdto(campaign.getClient());
            campaigndto.setClient(clientdto);
            return campaigndto;
        } else {
            throw new EntityNotFoundException("Client not found with name: " + reference);
        }
    }

    @Override
    public void archiveCampaign(String campaignReference) {
        Optional<Campaign> optionalCampaign = iCampaignRepository.findByReference(campaignReference);
        if (optionalCampaign.isPresent()) {
            Campaign campaign = optionalCampaign.get();

            CampaignArchive campaignArchive = iCampaignArchiveMapper.mapCampaignToCampaignArchive(campaign);
            iCampaignArchiveRepository.save(campaignArchive);
            iCampaignRepository.delete(campaign);
        }
    }

    @Override
    public void deletearchiveCampaign(String campaignReference) {
        Optional<CampaignArchive> optionalArchiveCampaign = iCampaignArchiveRepository.findByReference(campaignReference);
        if (optionalArchiveCampaign.isPresent()) {
            CampaignArchive campaignarchive = optionalArchiveCampaign.get();
            iCampaignArchiveRepository.delete(campaignarchive);
        }
    }

    @Override
    public List<Campaigndto> getArchivedCampaigns(){
        List<CampaignArchive> campaigns = iCampaignArchiveRepository.findAll();
        List<Campaigndto> campaignsdto = new ArrayList<>();
        if(!campaigns.isEmpty()) {
            for (CampaignArchive campaignArchive: campaigns) {
                Clientdto clientdto = iClientMapper.mapClientToClientdto(campaignArchive.getClient());
                Campaigndto campaigndto = iCampaignArchiveMapper.mapCampaignArchiveToCampaigndto(campaignArchive);
                campaigndto.setClient(clientdto);
                campaignsdto.add(campaigndto);
            }
        }
        return campaignsdto;
    }


}
