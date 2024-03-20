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

    @GetMapping("/getNewReclamations")
    public ResponseEntity<List<ReclamationDto>> getReclamations(@RequestParam String receiver) {
        List<ReclamationDto> reclamationDtos = iReclamationService.get30NewestReclamationsforReceiver(receiver);
        return ResponseEntity.ok(reclamationDtos);
    }
    @GetMapping("/getAllReclamationsForReceiver")
    public ResponseEntity<List<ReclamationDto>> getAllReclamationsForReceiver(@RequestParam String username) {
        List<ReclamationDto> reclamationDtos = iReclamationService.getAllReclamationsForReceiver(username);
        return ResponseEntity.ok(reclamationDtos);
    }
    @GetMapping("/getAllReclamationsForsender")
    public ResponseEntity<List<ReclamationDto>> getAllReclamationsForsender(@RequestParam String username) {
        List<ReclamationDto> reclamationDtos = iReclamationService.getAllReclamationsForsender(username);
        return ResponseEntity.ok(reclamationDtos);
    }

    @PutMapping("/terminateNotification/{username}")
    public ResponseEntity<Void> terminateNotification(@PathVariable("username") String username,
                                                      @RequestBody List<ReclamationDto> reclamationDtos) {
        iReclamationService.terminatenotif(username, reclamationDtos);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }


}
