package com.phoenix.services;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import com.phoenix.config.CaseInsensitiveHeaderColumnNameMappingStrategy;
import com.phoenix.dto.*;
import com.phoenix.dtokeycloakuser.Campaigndto;
import com.phoenix.kafka.StockProducer;
import com.phoenix.mapper.IAgentProdMapper;
import com.phoenix.mapper.ISoldProductDtoMapper;
import com.phoenix.mapper.IStockMapper;
import com.phoenix.model.*;
import com.phoenix.repository.IAgentProdRepository;
import com.phoenix.repository.IProductRepository;
import com.phoenix.repository.ISoldProductRepository;
import com.phoenix.repository.IStockRepository;
import com.phoenix.soldproductmapper.ISoldTProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SoldProductService  implements IsoldProductService{

    @Autowired
    private StockProducer stockProducer;

    private final IProductRepository iProductRepository;
    private final ISoldProductRepository iSoldProductRepository;
    private final ISoldTProductMapper iSoldTProductMapper;
    private final ISoldProductDtoMapper iSoldProductDtoMapper;
    private final IAgentProdMapper iAgentProdMapper;
    private final IAgentProdRepository iAgentProdRepository;
    private final IStockRepository iStockRepository;
    private final IStockMapper iStockMapper;
    private final WebClient.Builder webClientBuilder;

    @Override
    public void sellProduct(String prodRef, AgentProdDto agentsoldProdDto){
        LocalDate soldDate = LocalDate.now();
        Optional<Product> optionalProduct = iProductRepository.findById(prodRef);
        if(optionalProduct.isPresent()){


        Product product = optionalProduct.get();
        SoldProduct soldProduct = iSoldTProductMapper.tosoldProduct(product);

        AgentProd agentsoldProd = iAgentProdMapper.toEntity(agentsoldProdDto);
        if(product.getAgentProd().getAffectaiondate() != null) {
            agentsoldProd.setAffectaiondate(product.getAgentProd().getAffectaiondate());
        }
        if(product.getAgentProd().getDuesoldDate() != null) {
            agentsoldProd.setDuesoldDate(product.getAgentProd().getDuesoldDate());
        }
        if(product.getAgentProd().getReceivedDate() != null) {
            agentsoldProd.setReceivedDate(product.getAgentProd().getReceivedDate());
        }
        iAgentProdRepository.save(agentsoldProd);

        soldProduct.setCheckedSell(false);
        soldProduct.setAgentWhoSold(agentsoldProd);
        soldProduct.setSoldDate(soldDate);

        iProductRepository.delete(product);
        iSoldProductRepository.save(soldProduct);
        sendNotificationForSell (soldProduct);
        }
    }

    public void sendNotificationForSell (SoldProduct soldProduct){
        List<ReclamationDto> reclamationDtos = new ArrayList<>();
        ReclamationDto reclamationDto = new ReclamationDto();
        reclamationDto.setReclamationType(ReclamType.prodSoldType);
        reclamationDto.setSenderReference(soldProduct.getAgentWhoSold().getUsername());
        reclamationDto.setReceiverReference(Collections.singletonList(soldProduct.getManagerSoldProd().getUsername()));
        reclamationDto.setReclamationText("We're pleased to inform you that " +
                soldProduct.getAgentWhoSold().getUsername() + " has successfully closed a sale for the product with Serial Number: " +
                soldProduct.getSerialNumber() + " beloging to "+ soldProduct.getStock().getStockReference() +" stock. " +
                "As his manager, you are receiving this notification as part of our systematic update on recent events.");
        reclamationDtos.add(reclamationDto);
        StockEvent stockEvent = new StockEvent();
        stockEvent.setReclamationDtos(reclamationDtos);
        stockProducer.sendMessage(stockEvent);
        }

    @Override
    public Page<SoldProductDto> getSoldProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm) {

        Optional<Stock> stockOptional = iStockRepository.findById(stockreference);
        if (stockOptional.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }
        Stock stock = stockOptional.get();
        List<SoldProduct> soldproducts  = iSoldProductRepository.findByStock(stock);
        List<SoldProductDto> soldProductDtos = iSoldProductDtoMapper.toDtoList(soldproducts);
        for (int i = 0; i < soldProductDtos.size(); i++) {
            SoldProduct soldproduct = soldproducts.get(i);
            SoldProductDto soldproductDto = soldProductDtos.get(i);
            if(soldproduct.getAgentAssociatedProd() != null){
                AgentProdDto agentProdDto = iAgentProdMapper.toDto(soldproduct.getAgentAssociatedProd());
                soldproductDto.setAgentAssociatedProd(agentProdDto);
            }
            if(soldproduct.getManagerSoldProd() != null){
                AgentProdDto managerProdDto = iAgentProdMapper.toDto(soldproduct.getManagerSoldProd());
                soldproductDto.setManagerSoldProd(managerProdDto);
            }
            if(soldproduct.getAgentWhoSold() != null){
                AgentProdDto agentSoldProdDto = iAgentProdMapper.toDto(soldproduct.getAgentWhoSold());
                soldproductDto.setAgentWhoSold(agentSoldProdDto);
            }
        }
        if (!searchTerm.isEmpty()) {
            soldProductDtos = soldProductDtos.parallelStream()
                    .filter(soldProductDto -> filterBySearchTerm(soldProductDto, searchTerm))
                    .collect(Collectors.toList());
        }
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<SoldProductDto> pageContent;
        if (soldProductDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, soldProductDtos.size());
            pageContent = soldProductDtos.subList(startItem, toIndex);
        }
        return new PageImpl<>(pageContent, pageable, soldProductDtos.size());
    }
    private boolean filterBySearchTerm(SoldProductDto soldProductDto, String searchTerm) {
        String searchString = searchTerm.toLowerCase();
        StringBuilder searchFields = new StringBuilder();
        searchFields.append(soldProductDto.getSerialNumber().toLowerCase())
                .append(soldProductDto.getSimNumber().toLowerCase());
        if (soldProductDto.getAgentWhoSold() != null) {
            searchFields.append(soldProductDto.getAgentWhoSold().getFirstname().toLowerCase())
                    .append(soldProductDto.getAgentWhoSold().getLastname().toLowerCase());
        }
        if (soldProductDto.getManagerSoldProd() != null) {
            searchFields.append(soldProductDto.getManagerSoldProd().getFirstname().toLowerCase())
                    .append(soldProductDto.getManagerSoldProd().getLastname().toLowerCase());
        }
        if (soldProductDto.getAgentAssociatedProd() != null) {
            searchFields.append(soldProductDto.getAgentAssociatedProd().getFirstname().toLowerCase())
                    .append(soldProductDto.getAgentAssociatedProd().getLastname().toLowerCase());
        }
        return searchFields.toString().contains(searchString);
    }




    @Override
    public Page<SoldProductDto> getSoldProductsByusername(Pageable pageable, String username) {
        List<AgentProd> agentProds = iAgentProdRepository.findByUsername(username);
        List<SoldProduct> soldproducts = new ArrayList<>();
        for (AgentProd agentProd: agentProds){
            Optional<SoldProduct> optionalSoldProduct = iSoldProductRepository.findByAgentWhoSold(agentProd);
            if(optionalSoldProduct.isPresent()){
                SoldProduct soldproduct = optionalSoldProduct.get();
                soldproducts.add(soldproduct);
            }
        }
        if(soldproducts.isEmpty()){
            for (AgentProd agentProd: agentProds){
                Optional<SoldProduct> optionalSoldProduct = iSoldProductRepository.findByManagerSoldProd(agentProd);
                if(optionalSoldProduct.isPresent()){
                    SoldProduct soldproduct = optionalSoldProduct.get();
                    soldproducts.add(soldproduct);
                }
            }
        }
        List<SoldProductDto> soldproductDtos = iSoldProductDtoMapper.toDtoList(soldproducts);
        for (int i = 0; i < soldproducts.size(); i++) {
            SoldProduct soldproduct = soldproducts.get(i);
            SoldProductDto soldProductDto = soldproductDtos.get(i);
            if(soldproduct.getStock() != null){
                StockDto stockDto = iStockMapper.toDto(soldproduct.getStock());
                Campaigndto campaigndto = webClientBuilder.build().get()
                        .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", soldproduct.getStock().getCampaignRef())
                        .retrieve()
                        .bodyToMono(Campaigndto.class)
                        .block();
                stockDto.setCampaigndto(campaigndto);
                soldProductDto.setStock(stockDto);
            }
            if(soldproduct.getAgentWhoSold() != null){
                AgentProdDto agentProdDto = iAgentProdMapper.toDto(soldproduct.getAgentWhoSold());
                soldProductDto.setAgentWhoSold(agentProdDto);
            }
            if(soldproduct.getManagerSoldProd() != null){
                AgentProdDto managerProdDto = iAgentProdMapper.toDto(soldproduct.getManagerSoldProd());
                soldProductDto.setManagerSoldProd(managerProdDto);
            }
            if(soldproduct.getAgentAssociatedProd() != null){
                AgentProdDto agentAssociatedProd = iAgentProdMapper.toDto(soldproduct.getAgentAssociatedProd());
                soldProductDto.setAgentAssociatedProd(agentAssociatedProd);
            }
        }
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<SoldProductDto> pageContent;
        if (soldproductDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, soldproductDtos.size());
            pageContent = soldproductDtos.subList(startItem, toIndex);
        }
        return new PageImpl<>(pageContent, pageable, soldproductDtos.size());
    }



    @Override
    public List<String> uploadcsvTocheckSell(MultipartFile file, String stockReference) throws IOException {
        Map<String, String> serialNumberStatus = parseCsvCheck(file);
        List<String> notFoundserialNumbers = new ArrayList<>();
        Optional<Stock> stockOptional = iStockRepository.findById(stockReference);
        if(stockOptional.isPresent()) {
            Stock stock = stockOptional.get();
            List<SoldProduct> soldProducts = iSoldProductRepository.findByStock(stock);
            for (Map.Entry<String, String> entry : serialNumberStatus.entrySet()) {
                String serialNumber = entry.getKey();
                String status = entry.getValue();
                boolean found = false;
                for (SoldProduct soldproduct : soldProducts) {
                    if (soldproduct.getSerialNumber().equalsIgnoreCase(serialNumber) && status.equalsIgnoreCase("ACTIVE")) {
                        soldproduct.setCheckedSell(true);
                        iSoldProductRepository.save(soldproduct);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    notFoundserialNumbers.add(serialNumber);
                }
            }
        }
        return notFoundserialNumbers;
    }

    private Map<String, String> parseCsvCheck(MultipartFile file) throws IOException {
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            HeaderColumnNameMappingStrategy<SerialNumbersCsvRepresentation> strategy =
                    new HeaderColumnNameMappingStrategy<>();
            strategy.setType(SerialNumbersCsvRepresentation.class);
            CsvToBean<SerialNumbersCsvRepresentation> csvToBean =
                    new CsvToBeanBuilder<SerialNumbersCsvRepresentation>(reader)
                            .withMappingStrategy(strategy)
                            .withIgnoreEmptyLine(true)
                            .withIgnoreLeadingWhiteSpace(true)
                            .withSeparator(',')
                            .build();

            return csvToBean.parse()
                    .stream()
                    .filter(entry -> !entry.getSerialNumber().isEmpty())
                    .collect(Collectors.toMap(
                            SerialNumbersCsvRepresentation::getSerialNumber,
                            SerialNumbersCsvRepresentation::getStatus,
                            (existing, replacement) -> existing));
        }
    }


    @Override
    public Map<String, Integer> getSoldProductsInfosBystockReference(String stockreference) {
        Map<String, Integer> soldproductsInfo = new HashMap<>();
        Optional<Stock> stockOptional = iStockRepository.findById(stockreference);
        if (stockOptional.isEmpty()) {
            return null;
        }
        Stock stock = stockOptional.get();
        List<SoldProduct> soldproducts = iSoldProductRepository.findByStock(stock);
        if(!soldproducts.isEmpty()) {
            long checked = soldproducts.stream().filter(SoldProduct::isCheckedSell).count();
            int soldprods = soldproducts.size();
            soldproductsInfo.put("prods", soldprods);
            soldproductsInfo.put("checked", (int) checked);
        }
        return soldproductsInfo;
    }


    @Override
    public void returnProduct(String prodRef, AgentProdDto returnagentProd){
        LocalDate returnDate = LocalDate.now();
        Optional<SoldProduct> optionalSoldProduct = iSoldProductRepository.findById(prodRef);
        if(optionalSoldProduct.isPresent()){
            SoldProduct soldProduct = optionalSoldProduct.get();
            Product product = iSoldTProductMapper.toProduct(soldProduct);
            AgentProd returnedagentProd = iAgentProdMapper.toEntity(returnagentProd);
            iAgentProdRepository.save(returnedagentProd);
            product.setAgentReturnedProd(returnedagentProd);
            product.setCheckedExistence(false);
            product.setCheckin(returnDate);

            iProductRepository.save(product);
            iSoldProductRepository.delete(soldProduct);
            sendNotificationForReturn(product);
        }
    }

    public void sendNotificationForReturn (Product product){
        List<ReclamationDto> reclamationDtos = new ArrayList<>();
        ReclamationDto reclamationDto = new ReclamationDto();
        String soldby;
        if(Objects.equals(product.getAgentwhoSoldProd().getUsername(), product.getAgentReturnedProd().getUsername())) {
            soldby = "his";
        } else {
            soldby = product.getAgentwhoSoldProd().getUsername();
        }
        reclamationDto.setReclamationType(ReclamType.prodReturnType);
        reclamationDto.setSenderReference(product.getAgentReturnedProd().getUsername());
        reclamationDto.setReceiverReference(Collections.singletonList(product.getManagerProd().getUsername()));
        reclamationDto.setReclamationText(product.getAgentReturnedProd().getUsername().toUpperCase() +
                " has returned the product with Serial Number " +
                product.getSerialNumber() + " beloging to "+ product.getStock().getStockReference() +
                " stock, previously sold under " +
                soldby +
                " name. As his manager, you're being informed as part of our regular updates on recent returns.");
        reclamationDtos.add(reclamationDto);
        StockEvent stockEvent = new StockEvent();
        stockEvent.setReclamationDtos(reclamationDtos);
        stockProducer.sendMessage(stockEvent);
    }

    @Override
    public List<SoldProductDto> getThelast2SoldProdsByusername(String username) {
        List<AgentProd> agentProds = iAgentProdRepository.findByUsername(username);
        List<SoldProductDto> soldProductDtos = new ArrayList<>();
        int[] count = {0};

        for (AgentProd agentProd : agentProds) {
            Optional<SoldProduct> optionalSoldProduct = iSoldProductRepository.findByAgentWhoSold(agentProd);
            if (!optionalSoldProduct.isPresent()) {
                optionalSoldProduct = iSoldProductRepository.findByManagerSoldProd(agentProd);
            }
            optionalSoldProduct.ifPresent(product -> {
                if (count[0] < 2) {
                    SoldProductDto soldProductDto = iSoldProductDtoMapper.toDto(product);
                    soldProductDto.setAgentWhoSold(iAgentProdMapper.toDto(product.getAgentWhoSold()));
                    soldProductDtos.add(soldProductDto);
                    count[0]++;
                }
            });
        }
        soldProductDtos.sort(Comparator.comparing(SoldProductDto::getSoldDate).reversed());

        return soldProductDtos;
    }

}
