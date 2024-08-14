package com.phoenix.services;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import com.phoenix.config.CaseInsensitiveHeaderColumnNameMappingStrategy;
import com.phoenix.dto.*;
import com.phoenix.dtokeycloakuser.Campaigndto;
import com.phoenix.dtokeycloakuser.UserMysqldto;
import com.phoenix.dtokeycloakuser.Userdto;
import com.phoenix.mapper.IAgentProdMapper;
import com.phoenix.mapper.IProductMapper;
import com.phoenix.mapper.IStockMapper;
import com.phoenix.model.*;
import com.phoenix.repository.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.transaction.Transactional;
import lombok.Data;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService{
    @Autowired
    private IProductMapper iProductMapper;
    @Autowired
    private IProductRepository iProductRepository;

    @Autowired
    private ISoldProductRepository iSoldProductRepository;

    @Autowired
    private IStockMapper iStockMapper;
    @Autowired
    private IAgentProdMapper iAgentProdMapper;
    @Autowired
    private final KeycloakTokenFetcher tokenFetcher;

    private final WebClient.Builder webClientBuilder;

    @Autowired
    private IStockRepository iStockRepository;

    @Autowired
    private IUncheckHistoryRepository iUncheckHistoryRepository;
    @Autowired
    private IAgentProdRepository iAgentProdRepository;

    @Autowired
    private IAgentProdService iAgentProdService;
    @Override
    public void addProduct(ProductDto productDto) {
        Product product = iProductMapper.toEntity(productDto);
        product.setReturned(false);
        Stock stock = iStockMapper.toEntity(productDto.getStock());
        if (stock.getStockValue() == null) {
            stock.setStockValue(BigDecimal.ZERO);
        }
        product.setStock(stock);
        iProductRepository.save(product);
        if(product.getPrice() != null) {
            stock.setStockValue(stock.getStockValue().add(product.getPrice()));
        }
        stock.setChecked(false);
        iStockRepository.save(stock);
    }

    @Override
    public List<ProductDto> getProductsBystockReference(String stockreference) {
        Optional<Stock> stockOptional = iStockRepository.findById(stockreference);
        if (stockOptional.isEmpty()) {
            return null;
        }
        Stock stock = stockOptional.get();
        List<Product> product = iProductRepository.findByStock(stock);
        List<ProductDto> productdtos = iProductMapper.toDtoList(product);
        return productdtos;
    }

    @Override
    public Page<ProductDto> getProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm) {

        Optional<Stock> stockOptional = iStockRepository.findById(stockreference);
        if (stockOptional.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }
        Stock stock = stockOptional.get();
        List<Product> products  = iProductRepository.findByStockAndReturned(stock, false);
        List<ProductDto> productDtos = iProductMapper.toDtoList(products);
        for (int i = 0; i < productDtos.size(); i++) {
            Product product = products.get(i);
            ProductDto productDto = productDtos.get(i);
            if (product.getAgentProd() != null) {
                AgentProdDto agentProdDto = iAgentProdMapper.toDto(product.getAgentProd());
                productDto.setAgentProd(agentProdDto);
            }
            if (product.getManagerProd() != null) {
                AgentProdDto managerProdDto = iAgentProdMapper.toDto(product.getManagerProd());
                productDto.setManagerProd(managerProdDto);
            }
        }
        if (!searchTerm.isEmpty()) {
            productDtos = productDtos.parallelStream()
                    .filter(productDto -> filterBySearchTerm(productDto, searchTerm))
                    .collect(Collectors.toList());
        }
        // Sort productDtos by boxNumber numerically
        productDtos.sort(Comparator.comparingInt(dto -> {
            try {
                return Integer.parseInt(dto.getBoxNumber());
            } catch (NumberFormatException e) {
                // Handle cases where boxNumber is not a valid integer
                return Integer.MAX_VALUE; // Or some other default value
            }
        }));

        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<ProductDto> pageContent;
        if (productDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, productDtos.size());
            pageContent = productDtos.subList(startItem, toIndex);
        }
        return new PageImpl<>(pageContent, pageable, productDtos.size());
    }
    private boolean filterBySearchTerm(ProductDto productDto, String searchTerm) {
        String searchString = searchTerm.toLowerCase();
        StringBuilder searchFields = new StringBuilder();
        searchFields.append(productDto.getSerialNumber())
                .append(productDto.getSimNumber())
                .append(productDto.getBoxNumber());
        if (productDto.getAgentProd() != null) {
            searchFields.append(productDto.getAgentProd().getFirstname().toLowerCase())
                    .append(productDto.getAgentProd().getLastname().toLowerCase());
        }
        if (productDto.getManagerProd() != null) {
            searchFields.append(productDto.getManagerProd().getFirstname().toLowerCase())
                    .append(productDto.getManagerProd().getLastname().toLowerCase());
        }
        if (productDto.getAgentwhoSoldProd() != null) {
            searchFields.append(productDto.getAgentwhoSoldProd().getFirstname().toLowerCase())
                    .append(productDto.getAgentwhoSoldProd().getLastname().toLowerCase());
        }
        if (productDto.getAgentReturnedProd() != null) {
            searchFields.append(productDto.getAgentReturnedProd().getFirstname().toLowerCase())
                    .append(productDto.getAgentReturnedProd().getLastname().toLowerCase());
        }
        return searchFields.toString().contains(searchString);
    }

    @Override
    public ProductDto UpdateProduct(String serialNumber, ProductDto productDto) {
        Product product = iProductRepository.findById(serialNumber).orElse(null);
        Stock stock = product.getStock();
        BigDecimal tochangeValue = BigDecimal.ZERO;
        if (product == null) {return null;}
        if (productDto.getSimNumber() != null) {product.setSimNumber(productDto.getSimNumber());}
        if (productDto.getCheckin() != null) {product.setCheckin(productDto.getCheckin());}
        if (productDto.getBoxNumber() != null) {product.setBoxNumber(productDto.getBoxNumber());}
        if (productDto.getBrand() != null) {product.setBrand(productDto.getBrand());}
        if (productDto.getProductType() != null) {product.setProductType(productDto.getProductType());}
        if (productDto.getProdName() != null) {product.setProdName(productDto.getProdName());}
        if (productDto.getComments() != null) {product.setComments(productDto.getComments());}
        if (productDto.getPrice() != null) {product.setPrice(productDto.getPrice());}
        if (productDto.isReturned()) {product.setReturned(productDto.isReturned());}
        if (productDto.isCheckedExistence()) {product.setCheckedExistence(productDto.isCheckedExistence());}
        if (productDto.getPrice() != null) {
            tochangeValue = product.getPrice();
            product.setPrice(productDto.getPrice());
            Product savedproduct = iProductRepository.save(product);
            stock.setStockValue(stock.getStockValue().subtract(tochangeValue).add(product.getPrice()));
            iStockRepository.save(stock);
        } else {
            Product savedproduct = iProductRepository.save(product);
        }
        return productDto;
    }


    @Override
    public ProductDto getProductByserialNumber(String serialNumber) {
        Optional<Product> productOptional = iProductRepository.findById(serialNumber);
        if (productOptional.isEmpty()) {
            return null;
        }
        Product product = productOptional.get();
        ProductDto productDto = iProductMapper.toDto(product);
        productDto.setStock(iStockMapper.toDto(product.getStock()));
        if(product.getAgentProd() != null) {
            productDto.setAgentProd(iAgentProdMapper.toDto(product.getAgentProd()));
        }
        if(product.getManagerProd() != null) {
            productDto.setManagerProd(iAgentProdMapper.toDto(product.getManagerProd()));
        }
        return productDto;
    }





    @Override
    @Transactional
    public Integer addProductsByupload(MultipartFile file, String stockReference) throws IOException {
        List<ProductDto> productDtos = new ArrayList<>(parseCsv(file, stockReference));
        Optional<Stock> optionalstock = iStockRepository.findById(stockReference);
        if(optionalstock.isEmpty())
        {return  null;}
        else {
            Stock stock = optionalstock.get();
            List<Product> products = iProductMapper.toEntityList(productDtos);
            products.forEach(product -> product.setStock(stock));
            iProductRepository.saveAll(products);
            parseCsvForAssigning(file, stockReference);
            iStockRepository.save(stock);
            return productDtos.size();
        }
    }

    public Set<ProductDto> parseCsv(MultipartFile file, String stockReference) throws IOException {
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            HeaderColumnNameMappingStrategy<ProductDtosCsvRepresentation> strategy = new HeaderColumnNameMappingStrategy<>();
            strategy.setType(ProductDtosCsvRepresentation.class);
            CsvToBean<ProductDtosCsvRepresentation> csvToBean = new CsvToBeanBuilder<ProductDtosCsvRepresentation>(reader)
                    .withMappingStrategy(strategy)
                    .withIgnoreEmptyLine(true)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();

            // Read all lines into a list
            List<ProductDtosCsvRepresentation> csvLines = csvToBean.parse();

            // Create a map from "SHIPPED ESN" to "SHIPPED SIM"
            Map<String, String> shippedEsnToSimMap = csvLines.stream()
                    .filter(line -> line.getSimNumber() != null && !line.getSimNumber().isEmpty()) // Filter out null or empty SIM numbers
                    .collect(Collectors.toMap(
                            ProductDtosCsvRepresentation::getShippedserialNumber,
                            ProductDtosCsvRepresentation::getSimNumber,
                            (existing, replacement) -> existing // In case of duplicate keys, keep the existing value
                    ));

            AtomicBoolean checkedStock = new AtomicBoolean(true);
            Set<ProductDto> productDtos = csvLines.stream()
                    .filter(csvLine -> !csvLine.getSerialNumber().isEmpty() && !csvLine.getSerialNumber().equals("EOF"))
                    .map(csvLine -> {
                        BigDecimal price;
                        try {
                            String cost = csvLine.getCost().replace("$", "").trim();
                            price = new BigDecimal(cost);
                        } catch (Exception e) {
                            price = BigDecimal.ZERO;
                        }
                        String checked = csvLine.getChecked().trim().toUpperCase();
                        boolean checkedExistence = "YES".equals(checked) || "Y".equals(checked);

                        if (!checkedExistence) {
                            checkedStock.set(false);
                        }

                        // Look up the corresponding "SHIPPED SIM" for the "RECEIVED ESN"
                        String simNumber = shippedEsnToSimMap.getOrDefault(csvLine.getSerialNumber(), "0");
                        return ProductDto.builder()
                                .serialNumber(csvLine.getSerialNumber())
                                .boxNumber(csvLine.getBoxNumber())
                                .checkedExistence(checkedExistence)
                                .simNumber(simNumber)
                                .productType((csvLine.getProductType() == null) ? "none" : csvLine.getProductType())
                                .price(price)
                                .returned(false)
                                .comments(csvLine.getComments())
                                .build();
                    })
                    .collect(Collectors.toSet());

            updateStockCheckedStatus(stockReference, checkedStock.get());

            return productDtos;
        }
    }
    public void parseCsvForAssigning(MultipartFile file, String stockReference) throws IOException {
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            HeaderColumnNameMappingStrategy<ProductDtosCsvRepresentation> strategy =
                    new HeaderColumnNameMappingStrategy<>();
            strategy.setType(ProductDtosCsvRepresentation.class);
            CsvToBean<ProductDtosCsvRepresentation> csvToBean =
                    new CsvToBeanBuilder<ProductDtosCsvRepresentation>(reader)
                            .withMappingStrategy(strategy)
                            .withIgnoreEmptyLine(true)
                            .withIgnoreLeadingWhiteSpace(true)
                            .build();
            List<ProductDtosCsvRepresentation> csvLines = csvToBean.parse();
            Stock stock = iStockRepository.findById(stockReference)
                    .orElseThrow(() -> new RuntimeException("Stock not found for reference: " + stockReference));
            Map<String, String> usersMap = webClientBuilder.build().get()
                    .uri("http://keycloakuser-service/people/usersMap")
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, String>>() {})
                    .block();

            for (ProductDtosCsvRepresentation csvLine : csvLines) {
                if (!csvLine.getSerialNumber().isEmpty() && !csvLine.getSerialNumber().equals("EOF")) {
                    Optional<Product> optionalProduct = iProductRepository.findById(csvLine.getSerialNumber());
                    if (optionalProduct.isPresent()) {
                        Product product = optionalProduct.get();
                        ProductDto productDto = iProductMapper.toDto(product);
                        StockDto stockDto = iStockMapper.toDto(product.getStock());
                        productDto.setStock(stockDto);
                        AgentProdDto newManager = new AgentProdDto();
                        AgentProdDto newAgent = new AgentProdDto();
                        if (csvLine.getSeniorAdvisor() != null) {
                            String firstName = getFirstName(csvLine.getSeniorAdvisor().toLowerCase());
                            String lastName = getLastName(csvLine.getSeniorAdvisor().toLowerCase());
                            String fullName = firstName + lastName;
                            String username = firstName;
                            if (usersMap != null) {
                                for (Map.Entry<String, String> entry : usersMap.entrySet()) {
                                    if (entry.getValue().equals(fullName)) {
                                        username = entry.getKey();
                                    }
                                }
                            }
                            newManager.setFirstname(firstName);
                            newManager.setUsername(username);
                            newManager.setLastname(lastName);
                            newManager.setDuesoldDate(stock.getDueDate());
                            newManager.setReceivedDate(stock.getReceivedDate());
                            newManager.setSeniorAdvisor(true);
                            List<ProductDto> productDtoList = new ArrayList<>();
                            productDtoList.add(productDto);
                            newManager.setProductsManaged(productDtoList);

                        }
                        if (csvLine.getAgentAssigned() != null) {
                            String firstName = getFirstName(csvLine.getAgentAssigned());
                            String lastName = getLastName(csvLine.getAgentAssigned());
                            String fullName = firstName + lastName;
                            String username = firstName;
                            if (usersMap != null) {
                                for (Map.Entry<String, String> entry : usersMap.entrySet()) {
                                    if (entry.getValue().equals(fullName)) {
                                        username = entry.getKey();
                                    }
                                }
                            }
                            newAgent.setFirstname(firstName);
                            newAgent.setUsername(username);
                            newAgent.setLastname(lastName);
                            newAgent.setDuesoldDate(stock.getDueDate());
                            newAgent.setReceivedDate(stock.getReceivedDate());
                            newAgent.setSeniorAdvisor(false);
                            List<ProductDto> productDtoList = new ArrayList<>();
                            productDtoList.add(productDto);
                            newAgent.setProductsAssociated(productDtoList);
                        }
                        iAgentProdService.assignAgentandManager(newAgent, newManager);
                    }
                }
            }
        }
    }


    private void updateStockCheckedStatus(String stockReference, boolean checkStatus) {
        Optional<Stock> optionalStock = iStockRepository.findById(stockReference);
        if (optionalStock.isPresent()) {
            Stock stock = optionalStock.get();
            stock.setChecked(checkStatus);
            iStockRepository.save(stock);
        }
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
    public Page<ProductDto> getProductsPaginatedByusername(Pageable pageable, String username) {
        List<Product> duplicatedProducts = iProductRepository.findProductsByUsername(username);
        Set<Product> products = duplicatedProducts.stream()
                .filter(product -> !product.isReturned())
                .collect(Collectors.toSet());

        List<ProductDto> productDtos = products.stream()
                .map(product -> {
                    ProductDto productDto = iProductMapper.toDto(product);

                    // Map Stock to DTO with campaign info
                    if (product.getStock() != null) {
                        StockDto stockDto = iStockMapper.toDto(product.getStock());
                        Campaigndto campaigndto = webClientBuilder.build().get()
                                .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", product.getStock().getCampaignRef())
                                .retrieve()
                                .bodyToMono(Campaigndto.class)
                                .block();  // Consider async or caching
                        stockDto.setCampaigndto(campaigndto);
                        productDto.setStock(stockDto);
                    }

                    // Map AgentProd and ManagerProd to DTOs
                    if (product.getAgentProd() != null) {
                        productDto.setAgentProd(iAgentProdMapper.toDto(product.getAgentProd()));
                    }
                    if (product.getManagerProd() != null) {
                        productDto.setManagerProd(iAgentProdMapper.toDto(product.getManagerProd()));
                    }

                    return productDto;
                })
                .collect(Collectors.toList());

        // Sort the DTOs by BoxNumber
        productDtos.sort(Comparator.comparingInt(dto -> {
            try {
                return Integer.parseInt(dto.getBoxNumber());
            } catch (NumberFormatException e) {
                return Integer.MAX_VALUE;
            }
        }));

        // Implement pagination in memory
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;

        List<ProductDto> pageContent;
        if (productDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, productDtos.size());
            pageContent = productDtos.subList(startItem, toIndex);
        }

        return new PageImpl<>(pageContent, pageable, productDtos.size());
    }


    @Override
    public void checkProds(String stockreference, Set<String> prodsref) {
        Optional<Stock> optionalStock = iStockRepository.findById(stockreference);
        if (optionalStock.isPresent()) {
            Stock stock = optionalStock.get();
            List<Product> products = iProductRepository.findByStock(stock);
            List<Product> productsTosave = new ArrayList<>();
            boolean stockchecked = true;
            for (Product product : products) {
                if (prodsref.contains(product.getSerialNumber()) || prodsref.contains(product.getSimNumber())) {
                    product.setCheckedExistence(true);
                    productsTosave.add(product);
                } else {
                    if (!product.isCheckedExistence()) {
                        stockchecked = false;
                    }
                }
            }
            stock.setChecked(stockchecked);
            iProductRepository.saveAll(productsTosave);
            iStockRepository.save(stock);
            List<String> prodsrefNotInProducts = new ArrayList<>();
            for (String prodRef : prodsref) {
                boolean found = false;
                for (Product product : products) {
                    if (prodRef.equals(product.getSerialNumber()) || prodRef.equals(product.getSimNumber())) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    prodsrefNotInProducts.add(prodRef);
                }
            }
            if(!prodsrefNotInProducts.isEmpty()) {
                LocalDate now = LocalDate.now();
                UncheckHistory uncheckHistory = new UncheckHistory(prodsrefNotInProducts, now, stock.getStockReference());
                iUncheckHistoryRepository.save(uncheckHistory);
            }

        }
    }


    @Override
    public Map<String, Integer> getProductsInfosBystockReference(String stockreference) {
        Map<String, Integer> productsInfo = new HashMap<>();
        Optional<Stock> stockOptional = iStockRepository.findById(stockreference);
        if (stockOptional.isEmpty()) {
            return null;
        }
        Stock stock = stockOptional.get();
        List<Product> products = iProductRepository.findByStock(stock);
        if(!products.isEmpty()) {
            long checked = products.stream().filter(Product::isCheckedExistence).count();
            long returned = products.stream().filter(product -> product.isReturned()).count();

            int prods = products.size();
            productsInfo.put("prods", prods);
            productsInfo.put("checked", (int) checked);
            productsInfo.put("returned", (int) returned);
        }
        return productsInfo;
    }


    @Override
    public Page<ProductDto> getReturnedProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm) {

        Optional<Stock> stockOptional = iStockRepository.findById(stockreference);
        if (stockOptional.isEmpty()) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }
        Stock stock = stockOptional.get();
        List<Product> products  = iProductRepository.findByStockAndReturned(stock, true);
        List<ProductDto> productDtos = iProductMapper.toDtoList(products);
        for (int i = 0; i < productDtos.size(); i++) {
            Product product = products.get(i);
            ProductDto productDto = productDtos.get(i);
            if (product.getAgentProd() != null) {
                AgentProdDto agentProdDto = iAgentProdMapper.toDto(product.getAgentProd());
                productDto.setAgentProd(agentProdDto);
            }
            if (product.getManagerProd() != null) {
                AgentProdDto managerProdDto = iAgentProdMapper.toDto(product.getManagerProd());
                productDto.setManagerProd(managerProdDto);
            }
            if (product.getAgentwhoSoldProd() != null) {
                AgentProdDto agentwhoSoldProd = iAgentProdMapper.toDto(product.getAgentwhoSoldProd());
                productDto.setAgentwhoSoldProd(agentwhoSoldProd);
            }
            if (product.getAgentReturnedProd() != null) {
                AgentProdDto agentReturnedProd = iAgentProdMapper.toDto(product.getAgentReturnedProd());
                productDto.setAgentReturnedProd(agentReturnedProd);
            }
        }
        if (!searchTerm.isEmpty()) {
            productDtos = productDtos.parallelStream()
                    .filter(productDto -> filterBySearchTerm(productDto, searchTerm))
                    .collect(Collectors.toList());
        }
        productDtos.sort(Comparator.comparingInt(dto -> {
            try {
                return Integer.parseInt(dto.getBoxNumber());
            } catch (NumberFormatException e) {
                return Integer.MAX_VALUE;
            }
        }));
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<ProductDto> pageContent;
        if (productDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, productDtos.size());
            pageContent = productDtos.subList(startItem, toIndex);
        }
        return new PageImpl<>(pageContent, pageable, productDtos.size());
    }


    @Override
    @Transactional
    public List<ReclamationDto>  getProductsForAlert() {
        LocalDate currentDate = LocalDate.now();
        LocalDate sevenDaysLater = currentDate.plusDays(7);
        List<Stock> stocksForAlert = iStockRepository.findStocksDueWithinSevenDays(currentDate, sevenDaysLater);
        List<Product> productsByStock = iProductRepository.findByStockIn(stocksForAlert);
        List<AgentProd> alertsByAgent = iAgentProdRepository.findAgentsDueWithinSevenDays(currentDate, sevenDaysLater);
        List<Userdto> managers = getAllmanagers();
        Set<Product> products = new HashSet<>();
        alertsByAgent.forEach(agent -> products.addAll(agent.getProductsAssociated()));
        List<Product> filteredProductsByStock = productsByStock.stream()
                .filter(stockProduct -> products.stream().noneMatch(product -> Objects.equals(product.getSerialNumber(), stockProduct.getSerialNumber())))
                .toList();
        products.addAll(filteredProductsByStock);
        return products.stream()
                .map(product -> {
                    String serialNumbersExpired = product.getSerialNumber();
                    Date dueDate;
                    String agentAsignedToo = "";
                    String agentUsername = "";
                    if (product.getAgentProd() != null) {
                        dueDate = Date.from(product.getAgentProd().getDuesoldDate().atStartOfDay(ZoneId.systemDefault()).toInstant());
                        agentAsignedToo = product.getAgentProd().getFirstname() + " " + product.getAgentProd().getLastname();
                        agentUsername = product.getAgentProd().getUsername();
                    } else if(product.getStock() != null && product.getStock().getDueDate() != null){
                        dueDate = Date.from(product.getStock().getDueDate().atStartOfDay(ZoneId.systemDefault()).toInstant());
                    } else {
                        return null;
                    }
                    return createReclamationDto(serialNumbersExpired, dueDate, managers, agentAsignedToo, agentUsername);
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }


    private List<Userdto> getAllmanagers() {
        String token = tokenFetcher.getToken();
        List<Userdto> userDtos = null;
        try {
            userDtos = webClientBuilder.build().get()
                    .uri("http://keycloakuser-service/people/allusers")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                    .retrieve()
                    .bodyToFlux(Userdto.class)
                    .timeout(Duration.ofSeconds(10))
                    .collectList()
                    .block();
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (userDtos == null || userDtos.isEmpty()) {
            return null;
        }
        return userDtos.stream()
                .filter(userdto -> userdto.getRealmRoles().contains("MANAGER") ||
                        userdto.getRealmRoles().contains("IMANAGER"))
                .collect(Collectors.toList());
    }
    private ReclamationDto createReclamationDto(String serialNumbersExpired, Date dueDate, List<Userdto> managers, String agentAsignedToo, String agentUsername) {
        List<String> usernames = new ArrayList<>(managers.stream()
                .map(Userdto::getUsername)
                .toList());
        if (!agentUsername.isEmpty()) {
            usernames.add(agentUsername.toLowerCase());
        }

        SimpleDateFormat sdf = new SimpleDateFormat("dd MMM, yyyy", Locale.ENGLISH);
        String formattedDueDate = sdf.format(dueDate);
        Date now = new Date();
        long differenceMillis = dueDate.getTime() - now.getTime();
        long differenceDays = (differenceMillis / (1000 * 60 * 60 * 24)) + 1;
        if (differenceDays < 0) {
            differenceDays = Math.abs(differenceDays);
        }
        ReclamationDto reclamationDto = new ReclamationDto();
        reclamationDto.setSenderReference("UniStock Keeper");
        if(!agentAsignedToo.isEmpty()) {
            reclamationDto.setReclamationText("The expiration date for this product " +
                    "'" + serialNumbersExpired + "'" +
                    " assigned to " +
                    agentAsignedToo +
                    " in " +
                    +differenceDays +
                    " day(s). " +
                    " Please check the situation, the product will expire on " +
                    formattedDueDate);
        } else {
            reclamationDto.setReclamationText("The expiration date for this product " +
                    "'" + serialNumbersExpired +
                    " in " +
                    +differenceDays +
                    " day(s). " +
                    " Please check the situation, especially as the product is not assigned to any agent. The product will expire on " +
                    formattedDueDate);
        }
        reclamationDto.setReceiverReference(usernames);
        reclamationDto.setReclamationType(ReclamType.stockExpirationReminder);
        return reclamationDto;
    }

    @Override
    public Page<ProductDto> getProductsReturnedPaginatedByusername(Pageable pageable, String username) {
        List<Product> duplicatedProducts = iProductRepository.findProductsByUsername(username);
        Set<Product> returnedProducts = duplicatedProducts.stream()
                .filter(Product::isReturned)
                .collect(Collectors.toSet());

        List<ProductDto> productDtos = returnedProducts.stream()
                .map(product -> {
                    ProductDto productDto = iProductMapper.toDto(product);

                    // Map Stock to DTO with campaign info
                    if (product.getStock() != null) {
                        StockDto stockDto = iStockMapper.toDto(product.getStock());
                        Campaigndto campaigndto = webClientBuilder.build().get()
                                .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", product.getStock().getCampaignRef())
                                .retrieve()
                                .bodyToMono(Campaigndto.class)
                                .block();  // Consider async or caching
                        stockDto.setCampaigndto(campaigndto);
                        productDto.setStock(stockDto);
                    }

                    // Map AgentProd, AgentReturnedProd, AgentWhoSoldProd, and ManagerProd to DTOs
                    if (product.getAgentProd() != null) {
                        productDto.setAgentProd(iAgentProdMapper.toDto(product.getAgentProd()));
                    }
                    if (product.getAgentReturnedProd() != null) {
                        productDto.setAgentReturnedProd(iAgentProdMapper.toDto(product.getAgentReturnedProd()));
                    }
                    if (product.getAgentwhoSoldProd() != null) {
                        productDto.setAgentwhoSoldProd(iAgentProdMapper.toDto(product.getAgentwhoSoldProd()));
                    }
                    if (product.getManagerProd() != null) {
                        productDto.setManagerProd(iAgentProdMapper.toDto(product.getManagerProd()));
                    }

                    return productDto;
                })
                .collect(Collectors.toList());

        // Sort the DTOs by BoxNumber
        productDtos.sort(Comparator.comparingInt(dto -> {
            try {
                return Integer.parseInt(dto.getBoxNumber());
            } catch (NumberFormatException e) {
                return Integer.MAX_VALUE;
            }
        }));

        // Implement pagination in memory
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;

        List<ProductDto> pageContent;
        if (productDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, productDtos.size());
            pageContent = productDtos.subList(startItem, toIndex);
        }

        return new PageImpl<>(pageContent, pageable, productDtos.size());
    }
    @Override
    public void checkReturn(String serialNumber) {
        Product existingProduct = iProductRepository.findById(serialNumber)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        existingProduct.setReturnedstatus(true);
        iProductRepository.save(existingProduct);
    }

    @Override
    public List<ProductDto> getThelast2ReturnedProdsByusername(String username) {
        List<AgentProd> agentProds = iAgentProdRepository.findByUsername(username);
        List<ProductDto> productDtos = new ArrayList<>();
        int[] count = {0};

        for (AgentProd agentProd : agentProds) {
            Optional<Product> optionalProduct = iProductRepository.findByAgentReturnedProd(agentProd);
            if (!optionalProduct.isPresent()) {
                optionalProduct = iProductRepository.findByManagerProd(agentProd);
            }
            optionalProduct.ifPresent(product -> {
                if (product.isReturned() && count[0] < 2) {
                    ProductDto productDto = iProductMapper.toDto(product);
                    productDto.setAgentReturnedProd(iAgentProdMapper.toDto(product.getAgentReturnedProd()));
                    productDtos.add(productDto);
                    count[0]++;
                }
            });
        }
        productDtos.sort(Comparator.comparing(ProductDto::getCheckin).reversed());
        List<ProductDto> uniqueProducts = removeDuplicates(productDtos);
        return uniqueProducts;
    }



    @Override
    public List<ProductDto> getThelastMonthlyReturnedProds() {
        List<AgentProd> agentProds = iAgentProdRepository.findAll();
        List<ProductDto> productDtos = new ArrayList<>();
        YearMonth currentYearMonth = YearMonth.now();

        for (AgentProd agentProd : agentProds) {
            Optional<Product> optionalProduct = iProductRepository.findByAgentReturnedProd(agentProd);
            optionalProduct.ifPresent(product -> {
                if (product.isReturned()) {
                    LocalDate checkinDate = product.getCheckin();
                    if (checkinDate != null && checkinDate.getYear() == currentYearMonth.getYear() &&
                            checkinDate.getMonth() == currentYearMonth.getMonth()) {

                        ProductDto productDto = iProductMapper.toDto(product);
                        productDto.setAgentReturnedProd(iAgentProdMapper.toDto(product.getAgentReturnedProd()));
                        productDto.setManagerProd(iAgentProdMapper.toDto(product.getManagerProd()));
                        productDto.setStock(iStockMapper.toDto(product.getStock()));
                        productDtos.add(productDto);
                    }
                }
            });
        }
        productDtos.sort(Comparator.comparing(ProductDto::getCheckin).reversed());
        if(productDtos.isEmpty()){
            return null;
        }
        return productDtos;
    }


    @Override
    public List<Integer> getUserStat(String username) {
        username = username.toLowerCase();
        List<Product> products = iProductRepository.findProductsByUsername(username);
        List<SoldProduct> soldProductsDuplicated = iSoldProductRepository.findSoldProductsByUsername(username);
        Set<Product> associatedProducts = products.stream()
                .filter(product -> !product.isReturned())
                .collect(Collectors.toSet());
        Set<Product> returnedProducts = products.stream()
                .filter(Product::isReturned)
                .collect(Collectors.toSet());
        Set<SoldProduct> soldProducts = new HashSet<>(soldProductsDuplicated);
        List<Integer> statList = new ArrayList<>();
        statList.add(associatedProducts.size());
        statList.add(returnedProducts.size());
        statList.add(soldProducts.size());
        return statList;
    }

    @Override
    public int getProductNumberNow() {
        List<Product> products = iProductRepository.findAll();
        return products.size();
    }


    @Override
    public Map<String, Float> getReturnedProductsStatistics() {
        Map<String, Float> statistics = new HashMap<>();
        try {
            long countReturnedProductsCurrentMonth = iProductRepository.countReturnedProductsCurrentMonth();
            long countReturnedProductsPreviousMonth = iProductRepository.countReturnedProductsPreviousMonth();
            if (countReturnedProductsCurrentMonth == 0) {
                statistics.put("countReturnedProductsCurrentMonth", (float) countReturnedProductsCurrentMonth);
                statistics.put("growthRate", (float) 0);
            } else if (countReturnedProductsPreviousMonth == 0) {
                statistics.put("countReturnedProductsCurrentMonth", (float) countReturnedProductsCurrentMonth);
                statistics.put("growthRate", 100f);
            } else {
                float growthRate = ((float) countReturnedProductsCurrentMonth - countReturnedProductsPreviousMonth) / countReturnedProductsPreviousMonth * 100;
                statistics.put("countReturnedProductsCurrentMonth", (float) countReturnedProductsCurrentMonth);
                statistics.put("growthRate", growthRate);
            }
        } catch (Exception e) {
            e.printStackTrace();
            statistics.put("countReturnedProductsCurrentMonth", (float) 0);
            statistics.put("growthRate", (float) 0);
        }
        return statistics;
    }

    @Override
    public List<Integer> getProductsReturnedCount(){
        List<Integer> productsReturnedCount = new ArrayList<>();
        for(int i = 1 ; i <= 12 ; i++){
            int productsMonthReturned = iProductRepository.countReturnedProductsByMonth(i);
            productsReturnedCount.add(productsMonthReturned);
        }
        return productsReturnedCount;
    }

    @Override
    public void deleteProduct(String ref) {
        Optional<Product> optionalProduct = iProductRepository.findById(ref);
        System.out.println("optionalProduct is : " + optionalProduct);
        if(optionalProduct.isPresent()){
            Product product = optionalProduct.get();
            System.out.println("Product is : " + product);
            iProductRepository.delete(product);
        }
    }

    @Override
    public List<ProductDto> getThelast4ReturnedProdsByusername(String username) {
        List<AgentProd> agentProds = iAgentProdRepository.findByUsername(username);
        List<ProductDto> productDtos = new ArrayList<>();
        int[] count = {0};

        for (AgentProd agentProd : agentProds) {
            Optional<Product> optionalProduct = iProductRepository.findByAgentReturnedProd(agentProd);
            if (!optionalProduct.isPresent()) {
                optionalProduct = iProductRepository.findByManagerProd(agentProd);
            }
            optionalProduct.ifPresent(product -> {
                if (product.isReturned() && count[0] < 4) {
                    ProductDto productDto = iProductMapper.toDto(product);
                    productDto.setAgentReturnedProd(iAgentProdMapper.toDto(product.getAgentReturnedProd()));
                    productDtos.add(productDto);
                    count[0]++;
                }
            });
        }
        productDtos.sort(Comparator.comparing(ProductDto::getCheckin).reversed());
        List<ProductDto> uniqueProducts = removeDuplicates(productDtos);

        return uniqueProducts;
    }

    public static List<ProductDto> removeDuplicates(List<ProductDto> productDtos) {
        Set<String> encounteredSerialNumbers = new HashSet<>();
        List<ProductDto> uniqueProducts = new ArrayList<>();

        for (ProductDto productDto : productDtos) {
            String serialNumber = productDto.getSerialNumber();
            if (!encounteredSerialNumbers.contains(serialNumber)) {
                uniqueProducts.add(productDto);
                encounteredSerialNumbers.add(serialNumber);
            }
        }
        return uniqueProducts;
    }


    @Override
    public Page<ProductDto> getProductsPaginated(Pageable pageable, String searchTerm) {

        List<Product> allProducts = iProductRepository.findAll();
        List<Product> products = allProducts.stream()
                .filter(product -> !product.isReturned())
                .toList();
        List<ProductDto> productDtos = iProductMapper.toDtoList(products);
        for (int i = 0; i < productDtos.size(); i++) {
            Product product = products.get(i);
            ProductDto productDto = productDtos.get(i);
            if (product.getStock() != null) {
                StockDto stockDto = iStockMapper.toDto(product.getStock());
                productDto.setStock(stockDto);
            }
            if (product.getAgentProd() != null) {
                AgentProdDto agentProdDto = iAgentProdMapper.toDto(product.getAgentProd());
                productDto.setAgentProd(agentProdDto);
            }
            if (product.getManagerProd() != null) {
                AgentProdDto managerProdDto = iAgentProdMapper.toDto(product.getManagerProd());
                productDto.setManagerProd(managerProdDto);
            }
        }
        if (!searchTerm.isEmpty()) {
            productDtos = productDtos.parallelStream()
                    .filter(productDto -> filterBySearchTerm(productDto, searchTerm))
                    .collect(Collectors.toList());
        }
        productDtos.sort(Comparator.comparingInt(dto -> {
            try {
                return Integer.parseInt(dto.getBoxNumber());
            } catch (NumberFormatException e) {
                return Integer.MAX_VALUE;
            }
        }));
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<ProductDto> pageContent;
        if (productDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, productDtos.size());
            pageContent = productDtos.subList(startItem, toIndex);
        }
        return new PageImpl<>(pageContent, pageable, productDtos.size());
    }

    @Override
    public Page<ProductDto> getReturnedProductsPaginated(Pageable pageable, String searchTerm) {
        List<Product> allProducts = iProductRepository.findAll();
        List<Product> products = allProducts.stream()
                .filter(Product::isReturned)
                .toList();
        List<ProductDto> productDtos = iProductMapper.toDtoList(products);
        for (int i = 0; i < productDtos.size(); i++) {
            Product product = products.get(i);
            ProductDto productDto = productDtos.get(i);
            if (product.getStock() != null) {
                StockDto stockDto = iStockMapper.toDto(product.getStock());
                productDto.setStock(stockDto);
            }
            if (product.getAgentProd() != null) {
                AgentProdDto agentProdDto = iAgentProdMapper.toDto(product.getAgentProd());
                productDto.setAgentProd(agentProdDto);
            }
            if (product.getManagerProd() != null) {
                AgentProdDto managerProdDto = iAgentProdMapper.toDto(product.getManagerProd());
                productDto.setManagerProd(managerProdDto);
            }
            if (product.getAgentwhoSoldProd() != null) {
                AgentProdDto agentwhoSoldProd = iAgentProdMapper.toDto(product.getAgentwhoSoldProd());
                productDto.setAgentwhoSoldProd(agentwhoSoldProd);
            }
            if (product.getAgentReturnedProd() != null) {
                AgentProdDto agentReturnedProd = iAgentProdMapper.toDto(product.getAgentReturnedProd());
                productDto.setAgentReturnedProd(agentReturnedProd);
            }
        }
        if (!searchTerm.isEmpty()) {
            productDtos = productDtos.parallelStream()
                    .filter(productDto -> filterBySearchTerm(productDto, searchTerm))
                    .collect(Collectors.toList());
        }
        productDtos.sort(Comparator.comparingInt(dto -> {
            try {
                return Integer.parseInt(dto.getBoxNumber());
            } catch (NumberFormatException e) {
                return Integer.MAX_VALUE;
            }
        }));
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;
        List<ProductDto> pageContent;
        if (productDtos.size() < startItem) {
            pageContent = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, productDtos.size());
            pageContent = productDtos.subList(startItem, toIndex);
        }
        return new PageImpl<>(pageContent, pageable, productDtos.size());
    }
}
