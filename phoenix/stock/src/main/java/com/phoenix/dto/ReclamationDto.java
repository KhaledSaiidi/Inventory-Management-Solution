package com.phoenix.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ReclamationDto {
    private Long id;
    private ReclamType reclamationType;
    private String reclamationText;
    private String senderReference;
    private List<String> receiverReference;
    private List<String> vuedreceivers;
    private LocalDateTime reclamDate;

}
