package com.phoenix.controller;


import com.phoenix.dto.ReclamationDto;
import com.phoenix.services.IReclamationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class Controller {
    @Autowired
    IReclamationService iReclamationService;


    @PostMapping("/addReclamation")
    public ResponseEntity<Void> addReclamation(@RequestBody ReclamationDto reclamationDto) {
        iReclamationService.addReclamation(reclamationDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/getReclamations")
    public ResponseEntity<List<ReclamationDto>> getReclamations(@RequestParam List<String> receivers) {
        List<ReclamationDto> reclamationDtos = iReclamationService.get30NewestReclamationsforReceiver(receivers);
        return ResponseEntity.ok(reclamationDtos);
    }


}
