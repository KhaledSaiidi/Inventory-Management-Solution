package com.phoenix.services;

import com.phoenix.dto.Campaigndto;

import java.util.List;

public interface ICampaignServices {
    void addCampaign(Campaigndto campaigndto);
    List<Campaigndto> getCampaigns();

    Campaigndto UpdateCampaign(String reference, Campaigndto campaigndto);
    Campaigndto getCampaignByReference(String reference);
    void archiveCampaign(String campaignReference);
    List<Campaigndto> getArchivedCampaigns();
    void deletearchiveCampaign(String campaignReference);
}
