package com.phoenix.dtokeycloakuser;

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
