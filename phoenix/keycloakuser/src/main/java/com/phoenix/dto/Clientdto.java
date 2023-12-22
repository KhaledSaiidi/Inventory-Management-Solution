package com.phoenix.dto;

import com.phoenix.model.Campaign;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Clientdto {
    private String reference;

    private String companyName;
    private String companyemail;
    private Long companyphone;
    private String referentfirstName;

    private String referentlastName;
    private String referentemail;
    private Long referentphone;
    private List<Campaigndto> campaigns = new ArrayList<>();
}
