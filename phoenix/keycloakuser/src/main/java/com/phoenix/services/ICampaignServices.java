package com.phoenix.services;

import com.phoenix.dto.Campaigndto;

import java.util.List;

public interface ICampaignServices {
    void addCampaign(Campaigndto campaigndto);
    List<Campaigndto> getCampaigns();
}
