package com.phoenix.controller;

import com.phoenix.config.KeycloakSecurityUtil;
import com.phoenix.dto.Campaigndto;
import com.phoenix.dto.Clientdto;
import com.phoenix.dto.UserMysqldto;
import com.phoenix.dto.Userdto;
import com.phoenix.mapper.IMapper;
import com.phoenix.services.ICampaignServices;
import com.phoenix.services.IClientServices;
import com.phoenix.services.IUserServices;
import jakarta.persistence.EntityNotFoundException;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.NotFoundException;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin("*")
public class Controller {
    @Autowired
    KeycloakSecurityUtil keycloakUtil;
    @Autowired
    IMapper iMapper;
    @Autowired
    IUserServices iUserServices;
    @Autowired
    ICampaignServices icampaignService;
    @Autowired
    IClientServices iClientServices;


    @Value("${realm}")
    private String realm;

    @GetMapping
    @RequestMapping("/users")
    public List<Userdto> getUsers() {
        Keycloak keycloak = keycloakUtil.getKeycloakInstance();
        List<UserRepresentation> userRepresentations =
                keycloak.realm(realm).users().list();
        userRepresentations = userRepresentations.stream()
                .filter(userRep -> !userRep.getUsername().equals("admin"))
                .collect(Collectors.toList());
        return iMapper.mapUsers(userRepresentations);
    }

    @PostMapping
    @RequestMapping("/adduserdto")
    public Response createUser(@RequestBody Userdto userdto) {
        List<String> realmRoles = userdto.getRealmRoles();
        UserRepresentation userRep = iMapper.mapUserRep(userdto);
        Keycloak keycloak = keycloakUtil.getKeycloakInstance();
        keycloak.realm(realm).users().create(userRep);
        iUserServices.addUser(userdto);
        // Assign realm roles to the created userdto
        String userId = keycloak.realm(realm).users().search(userdto.getUsername()).get(0).getId();
        iUserServices.assignRoles(userId, userdto.getRealmRoles());

        return Response.ok(userdto).build();
    }

    @GetMapping("userdetails/{username}")
    public ResponseEntity<UserMysqldto> getUserByUsername(@PathVariable String username) {
        UserMysqldto userDto = iUserServices.getUserByUsername(username);

        if (userDto != null) {
            return new ResponseEntity<>(userDto, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping
    @RequestMapping("/allusers")
    public ResponseEntity<List<Userdto>> getallUsers() {
        List<Userdto> userdtos = iUserServices.getallUsers();
        if (userdtos != null) {
            return new ResponseEntity<>(userdtos, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping
    @RequestMapping("/updateUser/{username}")
    public Response updateUser(@PathVariable("username") String username, @RequestBody Userdto user) {
        try {
            Keycloak keycloak = keycloakUtil.getKeycloakInstance();
            List<UserRepresentation> users = keycloak.realm(realm).users().search(username);
            if (users.isEmpty()) {
                return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
            }
            UserRepresentation updatedUser = iMapper.mapUserRep(user);
            keycloak.realm(realm).users().get(users.get(0).getId()).update(updatedUser);

            iUserServices.UpdateUser(username, user);

            return Response.ok(updatedUser).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
        } catch (Exception e) {
            // Log the exception for debugging purposes
            e.printStackTrace();

            // Return a more detailed error response
            String errorMessage = "Error updating user: " + e.getMessage();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity(errorMessage).build();
        }
    }

    @DeleteMapping
    @RequestMapping("/deleteUser/{username}")
    public Response deleteUser(@PathVariable("username") String username) {
        Keycloak keycloak = keycloakUtil.getKeycloakInstance();
        String id = keycloak.realm(realm).users().search(username).get(0).getId();
        keycloak.realm(realm).users().delete(id);
        iUserServices.DeleteUser(username);
        return Response.ok().build();

    }

    @PutMapping
    @RequestMapping("/updatePassword/{username}")
    public Response updatePassword(@PathVariable("username") String username,
                                   @RequestParam("newPassword") String newPassword){
        Keycloak keycloak = keycloakUtil.getKeycloakInstance();
        List<UserRepresentation> users = keycloak.realm(realm).users().search(username);
        if (users.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).entity("User not found").build();
        }
        UserRepresentation updatedUser = users.get(0);
        List<CredentialRepresentation> creds = new ArrayList<>();
        CredentialRepresentation cred = new CredentialRepresentation();
        cred.setValue(newPassword);
        creds.add(cred);
        updatedUser.setCredentials(creds);
        keycloak.realm(realm).users().get(users.get(0).getId()).update(updatedUser);
        return Response.ok(updatedUser).build();
    }

    @PostMapping("/addCampaign")
    public ResponseEntity<Campaigndto> addCampaign(@RequestBody Campaigndto campaigndto) {
        icampaignService.addCampaign(campaigndto);
        return ResponseEntity.ok(campaigndto);
    }
    @GetMapping("/getCampaigns")
    public ResponseEntity<List<Campaigndto>> getCampaigns() {
        List<Campaigndto> campaigns = icampaignService.getCampaigns();
        return ResponseEntity.ok(campaigns);
    }

    @PostMapping("/addClient")
    public ResponseEntity<Clientdto> addClient(@RequestBody Clientdto clientdto) {
        iClientServices.addClient(clientdto);
        return ResponseEntity.ok(clientdto);
    }

    @GetMapping("/getClients")
    public ResponseEntity<List<Clientdto>> getClients() {
        List<Clientdto> clientdtos = iClientServices.getClients();
        return ResponseEntity.ok(clientdtos);
    }

    @GetMapping("/getClientByName/{clientName}")
    public ResponseEntity<Clientdto> getClientByName(@PathVariable String clientName) {
        try {
            Clientdto clientdto = iClientServices.getClientByName(clientName);
            return ResponseEntity.ok(clientdto);
        } catch (EntityNotFoundException e) {
            // Handle the case where the client with the given name is not found
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/updateClient/{reference}")
    public ResponseEntity<Clientdto> updateClient(@PathVariable("reference") String reference, @RequestBody Clientdto clientdto) {
        Clientdto updatedClientDto = iClientServices.UpdateClient(reference, clientdto);
        if (updatedClientDto != null) {
            return ResponseEntity.ok(updatedClientDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/updateCampaign/{reference}")
    public ResponseEntity<Campaigndto> updateCampaign(@PathVariable("reference") String reference, @RequestBody Campaigndto campaigndto) {
        Campaigndto updatedCampaigndto = icampaignService.UpdateCampaign(reference, campaigndto);
        if (updatedCampaigndto != null) {
            return ResponseEntity.ok(updatedCampaigndto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getCampaignByReference/{reference}")
    public ResponseEntity<Campaigndto> getCampaignByReference(@PathVariable String reference) {
        try {
            Campaigndto campaigndto = icampaignService.getCampaignByReference(reference);
            return ResponseEntity.ok(campaigndto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping
    @RequestMapping("/archive/{campaignReference}")
    public Response archiveCampaign(@PathVariable("campaignReference") String campaignReference) {
        icampaignService.archiveCampaign(campaignReference);
        return Response.ok().build();
    }

    @GetMapping("/getCampaignsarchived")
    public ResponseEntity<List<Campaigndto>> getCampaignsarchived() {
        List<Campaigndto> campaigns = icampaignService.getArchivedCampaigns();
        return ResponseEntity.ok(campaigns);
    }

    @DeleteMapping
    @RequestMapping("/deletearchivecampaign/{campaignReference}")
    public Response deleteArchiveCampaign(@PathVariable("campaignReference") String campaignReference) {
        icampaignService.deletearchiveCampaign(campaignReference);
        return Response.ok().build();
    }

}
