package com.phoenix.dto;

import com.phoenix.model.Client;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;

import java.util.Date;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Campaigndto {
    private String reference;

    private String campaignName;
    private List<String> products;
    private Date startDate;

    private String campaignDescription;
    private Clientdto client;

}
