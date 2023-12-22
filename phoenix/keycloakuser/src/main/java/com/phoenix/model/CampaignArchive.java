package com.phoenix.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "t_campaignarchive")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CampaignArchive {
    @jakarta.persistence.Id
    private String reference;

    private String campaignName;
    private String campaignDescription;
    private List<String> products;
    @Temporal(TemporalType.DATE)
    private Date startDate;

    @ManyToOne
    @JoinColumn(name = "client_reference", nullable = false)
    private Client client;
}
