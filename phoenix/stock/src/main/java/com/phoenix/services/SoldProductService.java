package com.phoenix.services;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import com.phoenix.config.CaseInsensitiveHeaderColumnNameMappingStrategy;
import com.phoenix.dto.*;
import com.phoenix.dtokeycloakuser.Campaigndto;
import com.phoenix.dtokeycloakuser.UserMysqldto;
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
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
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
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.function.Function;
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
            if(product.getAgentProd() != null) {
                LocalDate affectaiondate = product.getAgentProd().getAffectaiondate();
                if (affectaiondate != null) {
                    agentsoldProd.setAffectaiondate(product.getAgentProd().getAffectaiondate());
                }
                LocalDate duesoldDate = product.getAgentProd().getDuesoldDate();
                if (duesoldDate != null) {
                    agentsoldProd.setDuesoldDate(product.getAgentProd().getDuesoldDate());
                }
                LocalDate receivedDate = product.getAgentProd().getReceivedDate();
                if (receivedDate != null) {
                    agentsoldProd.setReceivedDate(product.getAgentProd().getReceivedDate());
                }

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
        List<String> encounteredSerialNumbers = new ArrayList<>();
        for (AgentProd agentProd: agentProds){
            Optional<SoldProduct> optionalSoldProduct1 = iSoldProductRepository.findByAgentWhoSold(agentProd);
            Optional<SoldProduct> optionalSoldProduct2 = iSoldProductRepository.findByManagerSoldProd(agentProd);
            Optional<SoldProduct> optionalSoldProduct = optionalSoldProduct1.or(() -> optionalSoldProduct2);
            if(optionalSoldProduct.isPresent()){
                SoldProduct soldproduct = optionalSoldProduct.get();
                String serialNumber = soldproduct.getSerialNumber();
                if (!encounteredSerialNumbers.contains(serialNumber)) {
                    soldproducts.add(soldproduct);
                    encounteredSerialNumbers.add(serialNumber);
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
    @Transactional
    public void uploadcsvTocheckSell(MultipartFile file, String stockReference) throws IOException {
        List<ParsedSoldProducts> parsedSoldProducts = parseCsvCheck(file);
        Optional<Stock> stockOptional = iStockRepository.findById(stockReference);
        if (stockOptional.isEmpty() || parsedSoldProducts.isEmpty()) {
            return;
        }
        Stock stock = stockOptional.get();
        List<SoldProduct> soldProducts = iSoldProductRepository.findByStock(stock);
        List<Product> products = iProductRepository.findByStock(stock);
        Map<String, String> usersMap = webClientBuilder.build().get()
                .uri("http://keycloakuser-service/people/usersMap")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<Map<String, String>>() {})
                .block();
        Map<String, SoldProduct> soldProductMap = soldProducts.stream()
                .collect(Collectors.toMap(SoldProduct::getSerialNumber, Function.identity()));

        Map<String, Product> productMap = products.stream()
                .collect(Collectors.toMap(Product::getSerialNumber, Function.identity()));

        for (ParsedSoldProducts parsedProduct : parsedSoldProducts) {
            processParsedProduct(parsedProduct, soldProductMap, productMap, usersMap);
        }
    }

    private List<ParsedSoldProducts> parseCsvCheck(MultipartFile file) throws IOException {
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            HeaderColumnNameMappingStrategy<SerialNumbersCsvRepresentation> strategy = new HeaderColumnNameMappingStrategy<>();
            strategy.setType(SerialNumbersCsvRepresentation.class);
            CsvToBean<SerialNumbersCsvRepresentation> csvToBean = new CsvToBeanBuilder<SerialNumbersCsvRepresentation>(reader)
                    .withMappingStrategy(strategy)
                    .withIgnoreEmptyLine(true)
                    .withIgnoreLeadingWhiteSpace(true)
                    .withSeparator(',')
                    .build();

            List<SerialNumbersCsvRepresentation> serialNumbersCsvList = csvToBean.parse();
            return serialNumbersCsvList.stream()
                    .filter(serialNumbersCsv -> !serialNumbersCsv.getSerialNumber().isEmpty())
                    .map(this::convertToParsedSoldProducts)
                    .collect(Collectors.toList());
        }
    }

    private ParsedSoldProducts convertToParsedSoldProducts(SerialNumbersCsvRepresentation serialNumbersCsv) {
        ParsedSoldProducts parsedSoldProducts = new ParsedSoldProducts();
        parsedSoldProducts.setSerialNumber(serialNumbersCsv.getSerialNumber());
        parsedSoldProducts.setStatus(serialNumbersCsv.getStatus());
        parsedSoldProducts.setAgent(serialNumbersCsv.getAgent());

        if (serialNumbersCsv.getCheckOut() != null && !serialNumbersCsv.getCheckOut().isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("[M/d/yyyy][M-d-yyyy][MM/dd/yy]");
            try {
                parsedSoldProducts.setCheckOut(LocalDate.parse(serialNumbersCsv.getCheckOut(), formatter));
            } catch (DateTimeParseException e) {
                System.err.println("Error parsing date: " + serialNumbersCsv.getCheckOut());
                parsedSoldProducts.setCheckOut(LocalDate.now());
            }

        } else {
            parsedSoldProducts.setCheckOut(LocalDate.now());
        }


        return parsedSoldProducts;
    }

    private void processParsedProduct(ParsedSoldProducts parsedProduct, Map<String, SoldProduct> soldProductMap,
                                      Map<String, Product> productMap, Map<String, String> usersMap) {
        SoldProduct soldProduct = soldProductMap.get(parsedProduct.getSerialNumber());
        if (soldProduct != null) {
            updateSoldProduct(parsedProduct, soldProduct);
            return;
        }

        Product product = productMap.get(parsedProduct.getSerialNumber());
        if (product != null && parsedProduct.getStatus() != null) {
            processProduct(parsedProduct, product, usersMap);
        }
    }

    private void updateSoldProduct(ParsedSoldProducts parsedProduct, SoldProduct soldProduct) {
        if (isProductActive(parsedProduct.getStatus())) {
            soldProduct.setCheckedSell(true);
            iSoldProductRepository.save(soldProduct);
        }
    }

    private void processProduct(ParsedSoldProducts parsedProduct, Product product, Map<String, String> usersMap) {
        if (isProductActive(parsedProduct.getStatus())) {
            String username = resolveUsername(parsedProduct.getAgent(), usersMap);
            AgentProdDto agentsoldProdDto = createAgentProdDto(parsedProduct, username);
            SoldProduct soldProduct = iSoldTProductMapper.tosoldProduct(product);
            AgentProd agentsoldProd = iAgentProdMapper.toEntity(agentsoldProdDto);
            if(product.getAgentProd() != null) {
                LocalDate affectaiondate = product.getAgentProd().getAffectaiondate();
                if (affectaiondate != null) {
                    agentsoldProd.setAffectaiondate(product.getAgentProd().getAffectaiondate());
                }
                LocalDate duesoldDate = product.getAgentProd().getDuesoldDate();
                if (duesoldDate != null) {
                    agentsoldProd.setDuesoldDate(product.getAgentProd().getDuesoldDate());
                }
                LocalDate receivedDate = product.getAgentProd().getReceivedDate();
                if (receivedDate != null) {
                    agentsoldProd.setReceivedDate(product.getAgentProd().getReceivedDate());
                }
            }
            iAgentProdRepository.save(agentsoldProd);
            soldProduct.setCheckedSell(true);
            soldProduct.setAgentWhoSold(agentsoldProd);
            soldProduct.setSoldDate(parsedProduct.getCheckOut());
            iProductRepository.delete(product);
            iSoldProductRepository.save(soldProduct);
        }
    }

    private boolean isProductActive(String status) {
        return status.equalsIgnoreCase("ACTIVE") || status.equalsIgnoreCase("YES") || status.equalsIgnoreCase("Y");
    }
    private String resolveUsername(String agent, Map<String, String> usersMap) {
        String firstName = getFirstName(agent);
        String lastName = getLastName(agent);
        String fullName = firstName + lastName;

        return usersMap.entrySet().stream()
                .filter(entry -> entry.getValue().equals(fullName))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElse(firstName);
    }


    private AgentProdDto createAgentProdDto(ParsedSoldProducts parsedProduct, String username) {
        AgentProdDto agentProdDto = new AgentProdDto();
        agentProdDto.setFirstname(getFirstName(parsedProduct.getAgent()));
        agentProdDto.setLastname(getLastName(parsedProduct.getAgent()));
        agentProdDto.setUsername(username);
        return agentProdDto;
    }


    private String getFirstName(String fullName) {
        if (fullName != null && !fullName.trim().isEmpty()) {
            String[] parts = fullName.split("\\s+");
            return parts.length > 0 ? parts[0].toLowerCase() : "";
        }
        return "";
    }

    private String getLastName(String fullName) {
        if (fullName != null && !fullName.trim().isEmpty()) {
            String[] parts = fullName.split("\\s+");
            return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
        }
        return "";
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
        List<SoldProductDto> uniqueSoldProducts = removeDuplicates(soldProductDtos);

        return uniqueSoldProducts;
    }

    @Override
    public List<TopSalesDto> getlastMonthlySoldProds() {
        YearMonth currentYearMonth = YearMonth.now();
        YearMonth previousYearMonth = currentYearMonth.minusMonths(1);

        List<SoldProduct> monthlySoldProducts = iSoldProductRepository.findMonthlySoldProducts(
                currentYearMonth.getYear(), currentYearMonth.getMonthValue());
        monthlySoldProducts.sort(Comparator.comparing(SoldProduct::getSoldDate).reversed());

        List<SoldProduct> lastMonthlySoldProducts = iSoldProductRepository.findMonthlySoldProducts(
                previousYearMonth.getYear(), previousYearMonth.getMonthValue());
        lastMonthlySoldProducts.sort(Comparator.comparing(SoldProduct::getSoldDate).reversed());

        Set<TopSalesDto> salesByAgent = new HashSet<>();

        for (SoldProduct soldProduct : monthlySoldProducts) {
            String username = soldProduct.getAgentWhoSold().getUsername();
            System.out.println("username :" + username);
            String fullName = (soldProduct.getAgentWhoSold().getFirstname() + " " +
                    soldProduct.getAgentWhoSold().getLastname()).toUpperCase();
            Optional<TopSalesDto> optionalDto = salesByAgent.stream()
                    .filter(dto -> dto.getFullname().equals(fullName))
                    .findFirst();
            if (optionalDto.isPresent()) {
                optionalDto.get().setTotalsales(optionalDto.get().getTotalsales() + 1);
            } else {
                TopSalesDto topSalesDto = new TopSalesDto();
                topSalesDto.setFullname(fullName);
                topSalesDto.setTotalsales(1);
                topSalesDto.setGrowth(0);
                topSalesDto.setTotalsalesLastMonth(0);
                salesByAgent.add(topSalesDto);
            }
        }

        for (SoldProduct soldProduct : lastMonthlySoldProducts) {
            String username = soldProduct.getAgentWhoSold().getUsername();
            String fullName = (soldProduct.getAgentWhoSold().getFirstname() + " " +
                    soldProduct.getAgentWhoSold().getLastname()).toUpperCase();
            Optional<TopSalesDto> optionalDto = salesByAgent.stream()
                    .filter(dto -> dto.getFullname().equals(fullName))
                    .findFirst();
            if (optionalDto.isPresent()) {
                optionalDto.get().setTotalsalesLastMonth(optionalDto.get().getTotalsalesLastMonth() + 1);
            }
        }

        // Process  and calculate growth
        for (TopSalesDto dto : salesByAgent) {
            int currentMonthSales = dto.getTotalsales();
            int lastMonthSales = dto.getTotalsalesLastMonth();
            if (lastMonthSales != 0 && currentMonthSales != 0) {
                float growth = ((float) (currentMonthSales - lastMonthSales) / lastMonthSales) * 100;
                dto.setGrowth(growth);
            } else if (lastMonthSales == 0 && currentMonthSales != 0) {
                dto.setGrowth(100);
            } else if (lastMonthSales != 0 && currentMonthSales == 0) {
                dto.setGrowth(-100);
            } else {
                dto.setGrowth(0);
            }
        }
        List<TopSalesDto> salesList = new ArrayList<>(salesByAgent);

        salesList.sort(Comparator.comparingInt(TopSalesDto::getTotalsales).reversed());

        return salesList;
    }

    @Override
    public Map<String, Float> getSoldProductsStatistics() {
        Map<String, Float> statistics = new HashMap<>();
        try {
            long countSoldProductsCurrentMonth = iSoldProductRepository.countSoldProductsCurrentMonth();
            long countSoldProductsPreviousMonth = iSoldProductRepository.countSoldProductsPreviousMonth();
            if (countSoldProductsCurrentMonth == 0) {
                statistics.put("countSoldProductsCurrentYear", (float) countSoldProductsCurrentMonth);
                statistics.put("growthRate", (float) 0);
            } else if (countSoldProductsPreviousMonth == 0) {
                statistics.put("countSoldProductsCurrentYear", (float) countSoldProductsCurrentMonth);
                statistics.put("growthRate", 100f);
            } else {
                float growthRate = ((float) countSoldProductsCurrentMonth - countSoldProductsPreviousMonth) / countSoldProductsPreviousMonth * 100;
                statistics.put("countSoldProductsCurrentYear", (float) countSoldProductsCurrentMonth);
                statistics.put("growthRate", growthRate);
            }
        } catch (Exception e) {
            e.printStackTrace();
            statistics.put("countSoldProductsCurrentYear", (float) 0);
            statistics.put("growthRate", (float) 0);
        }
        return statistics;
    }

    @Override
    public List<Integer> getProductsSoldCount(){
        List<Integer> productsSoldCount = new ArrayList<>();
        for(int i = 1 ; i <= 12 ; i++){
            int productsMonthSold = iSoldProductRepository.countSoldProductsByMonth(i);
            productsSoldCount.add(productsMonthSold);
        }
        return productsSoldCount;

    }


    @Override
    public void deleteSoldProduct(String ref) {
        Optional<SoldProduct> optionalSoldProduct = iSoldProductRepository.findById(ref);
        if(optionalSoldProduct.isPresent()){
            SoldProduct soldProduct = optionalSoldProduct.get();
            iSoldProductRepository.delete(soldProduct);
        }
    }


    @Override
    public List<SoldProductDto> getThelast4SoldProdsByusername(String username) {
        List<AgentProd> agentProds = iAgentProdRepository.findByUsername(username);
        List<SoldProductDto> soldProductDtos = new ArrayList<>();
        int[] count = {0};

        for (AgentProd agentProd : agentProds) {
            Optional<SoldProduct> optionalSoldProduct = iSoldProductRepository.findByAgentWhoSold(agentProd);
            if (!optionalSoldProduct.isPresent()) {
                optionalSoldProduct = iSoldProductRepository.findByManagerSoldProd(agentProd);
            }
            optionalSoldProduct.ifPresent(product -> {
                if (count[0] < 4) {
                    SoldProductDto soldProductDto = iSoldProductDtoMapper.toDto(product);
                    soldProductDto.setAgentWhoSold(iAgentProdMapper.toDto(product.getAgentWhoSold()));
                    soldProductDtos.add(soldProductDto);
                    count[0]++;
                }
            });
        }
        soldProductDtos.sort(Comparator.comparing(SoldProductDto::getSoldDate).reversed());
        List<SoldProductDto> uniqueSoldProducts = removeDuplicates(soldProductDtos);

        return uniqueSoldProducts;
    }

    public static List<SoldProductDto> removeDuplicates(List<SoldProductDto> soldProductDtos) {
        Set<String> encounteredSerialNumbers = new HashSet<>();
        List<SoldProductDto> uniqueSoldProducts = new ArrayList<>();

        for (SoldProductDto soldProductDto : soldProductDtos) {
            String serialNumber = soldProductDto.getSerialNumber();
            if (!encounteredSerialNumbers.contains(serialNumber)) {
                uniqueSoldProducts.add(soldProductDto);
                encounteredSerialNumbers.add(serialNumber);
            }
        }

        return uniqueSoldProducts;
    }

    @Override
    public Page<SoldProductDto> getSoldProductsPaginated(Pageable pageable, String searchTerm) {
        List<SoldProduct> soldproducts  = iSoldProductRepository.findAll();
        List<SoldProductDto> soldProductDtos = iSoldProductDtoMapper.toDtoList(soldproducts);
        for (int i = 0; i < soldProductDtos.size(); i++) {
            SoldProduct soldproduct = soldproducts.get(i);
            SoldProductDto soldproductDto = soldProductDtos.get(i);
            if (soldproduct.getStock() != null) {
                StockDto stockDto = iStockMapper.toDto(soldproduct.getStock());
                soldproductDto.setStock(stockDto);
            }
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

}
