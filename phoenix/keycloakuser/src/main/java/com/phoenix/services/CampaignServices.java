package com.phoenix.services;

import com.phoenix.dto.Campaigndto;
import com.phoenix.dto.Clientdto;
import com.phoenix.dtostock.StockDto;
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
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import javax.swing.text.html.Option;
import java.util.*;

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

    private final WebClient.Builder webClientBuilder;


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
        if (campaign == null) {
            return null;
        }
        if (campaigndto.getCampaignName() != null) {
            campaign.setCampaignName(campaigndto.getCampaignName());
        }
        if (campaigndto.getStartDate() != null) {
            campaign.setStartDate(campaigndto.getStartDate());
        }
        if (campaigndto.getCampaignDescription() != null) {
            campaign.setCampaignDescription(campaigndto.getCampaignDescription());
        }
        if (campaigndto.getClient().getReference() != null) {
            Optional<Client> optionalClient = iClientRepository.findByReference(campaigndto.getClient().getReference());
            Client client = optionalClient.orElse(null);
            campaign.setClient(client);
        }
        if (campaigndto.getProducts() != null){
            campaign.setProducts(campaigndto.getProducts());
            List<StockDto> optionalstocksDto = webClientBuilder.build().get()
                .uri("http://stock-service/stock/returnstockBycampaignRef/{campreference}", reference)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<StockDto>>() {
                })
                .block();
        if (!optionalstocksDto.isEmpty()) {
            for (StockDto stockDto : optionalstocksDto) {
                stockDto.setProductTypes(campaigndto.getProducts());
                webClientBuilder.build().put()
                        .uri("http://stock-service/stock/UpdateStock/{reference}", stockDto.getStockReference())
                        .bodyValue(stockDto)
                        .exchange()
                        .subscribe();
            }
        }
    }
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
            webClientBuilder.build()
                    .post()
                    .uri("http://stock-service/stock/archive/" + campaignReference)
                    .retrieve()
                    .toBodilessEntity()
                    .block();
            iCampaignRepository.delete(campaign);
        }
    }

    @Override
    public void deletearchiveCampaign(String campaignReference) {
        Optional<CampaignArchive> optionalArchiveCampaign = iCampaignArchiveRepository.findByReference(campaignReference);
        if (optionalArchiveCampaign.isPresent()) {
            CampaignArchive campaignarchive = optionalArchiveCampaign.get();
            webClientBuilder.build()
                    .delete()
                    .uri("http://stock-service/stock/deletearchive/" + campaignReference)
                    .retrieve()
                    .toBodilessEntity()
                    .block();

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
    @Override
    public Campaigndto getArchivedCampaign(String ref){
        Optional<CampaignArchive> optionalcampaignArchive  = iCampaignArchiveRepository.findById(ref);
        Campaigndto campaigndto = new Campaigndto();
        if(optionalcampaignArchive.isPresent()) {
            CampaignArchive campaignArchive = optionalcampaignArchive.get();
            Clientdto clientdto = iClientMapper.mapClientToClientdto(campaignArchive.getClient());
            campaigndto = iCampaignArchiveMapper.mapCampaignArchiveToCampaigndto(campaignArchive);
            campaigndto.setClient(clientdto);
            return campaigndto;
        } else {
            return null;
        }
    }


    @Override
    public Map<String, Float> getCampaignStatistics() {
        Map<String, Float> statistics = new HashMap<>();
        try {
            long countCampaignsCurrentYear = iCampaignRepository.countCampaignsCurrentYear();
            long countCampaignsPrevioustYear = iCampaignRepository.countCampaignsPreviousMonth();

            if (countCampaignsCurrentYear == 0) {
                statistics.put("countCampaignsCurrentYear", (float) 0);
                statistics.put("growthRate", (float) 0);
            } else if (countCampaignsPrevioustYear == 0) {
                statistics.put("countCampaignsCurrentYear", (float) countCampaignsCurrentYear);
                statistics.put("growthRate", 100f);
            } else {
                float growthRate = ((float) countCampaignsCurrentYear - countCampaignsPrevioustYear) / countCampaignsPrevioustYear * 100;
                statistics.put("countCampaignsCurrentYear", (float) countCampaignsCurrentYear);
                statistics.put("growthRate", growthRate);
            }
        } catch (Exception e) {
            e.printStackTrace();
            statistics.put("countCampaignsCurrentYear", (float) 0);
            statistics.put("growthRate", (float) 0);
        }
        return statistics;
    }


}
