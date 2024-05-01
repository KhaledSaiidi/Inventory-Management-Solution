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
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.transaction.annotation.Transactional;
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
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
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
        searchFields.append(productDto.getSerialNumber().toLowerCase())
                .append(productDto.getSimNumber().toLowerCase());
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
    public Integer addProductsByupload(MultipartFile file, String stockReference) throws IOException {
        List<ProductDto> productDtos = new ArrayList<>(parseCsv(file));
        Optional<Stock> optionalstock = iStockRepository.findById(stockReference);
        if(optionalstock.isEmpty())
        {return  null;}
        else {
            Stock stock = optionalstock.get();
            List<Product> products = iProductMapper.toEntityList(productDtos);
            products.forEach(product -> product.setStock(stock));
            iProductRepository.saveAll(products);
            stock.setChecked(false);
            iStockRepository.save(stock);
            return productDtos.size();
        }
    }

    private Set<ProductDto> parseCsv(MultipartFile file) throws IOException {
        try (Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream())) ){
            HeaderColumnNameMappingStrategy<ProductDtosCsvRepresentation> strategy =
                    new HeaderColumnNameMappingStrategy<>();
            strategy.setType(ProductDtosCsvRepresentation.class);
            CsvToBean<ProductDtosCsvRepresentation> csvToBean =
                    new CsvToBeanBuilder<ProductDtosCsvRepresentation>(reader)
                            .withMappingStrategy(strategy)
                            .withIgnoreEmptyLine(true)
                            .withIgnoreLeadingWhiteSpace(true)
                            .build();
            return csvToBean.parse()
                    .stream()
                    .filter(csvLine -> !csvLine.getSerialNumber().isEmpty() && !csvLine.getSerialNumber().equals("EOF"))
                    .map(csvLine -> ProductDto.builder()
                            .serialNumber(csvLine.getSerialNumber())
                            .simNumber(csvLine.getSimNumber())
                            .productType(csvLine.getProductType())
                            .returned(false)
                            .build())
                    .collect(Collectors.toSet());
        }
    }

    @Override
    public Page<ProductDto> getProductsPaginatedByusername(Pageable pageable, String username) {
        List<AgentProd> agentProds = iAgentProdRepository.findByUsername(username);
        List<Product> products = new ArrayList<>();
        for (AgentProd agentProd: agentProds){
            Optional<Product> optionalProduct = iProductRepository.findByAgentProd(agentProd);
            if(optionalProduct.isPresent()){
                Product product = optionalProduct.get();
                products.add(product);
            }
        }
        if(products.isEmpty()){
            for (AgentProd agentProd: agentProds){
                Optional<Product> optionalProduct = iProductRepository.findByManagerProd(agentProd);
                if(optionalProduct.isPresent()){
                    Product product = optionalProduct.get();
                    products.add(product);
                }
            }
        }
        List<ProductDto> productDtos = products.stream()
                .filter(product -> !product.isReturned())
                .map(iProductMapper::toDto)
                .collect(Collectors.toList());

        for (int i = 0; i < productDtos.size(); i++) {
            Product product = products.get(i);
            ProductDto productDto = productDtos.get(i);
                if (product.getStock() != null) {
                    StockDto stockDto = iStockMapper.toDto(product.getStock());
                    Campaigndto campaigndto = webClientBuilder.build().get()
                            .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", product.getStock().getCampaignRef())
                            .retrieve()
                            .bodyToMono(Campaigndto.class)
                            .block();
                    stockDto.setCampaigndto(campaigndto);
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
    public List<ReclamationDto>  getProductsForAlert() {
        LocalDate currentDate = LocalDate.now();
        LocalDate sevenDaysLater = currentDate.plusDays(7);
        List<Stock> stocksForAlert = iStockRepository.findStocksDueWithinSevenDays(currentDate, sevenDaysLater);
        List<Product> productsByStock = iProductRepository.findByStockIn(stocksForAlert);
        List<AgentProd> alertsByAgent = iAgentProdRepository.findAgentsDueWithinSevenDays(currentDate, sevenDaysLater);
        List<Userdto> managers = getAllmanagers();

        Set<Product> products = new HashSet<>();
        alertsByAgent.forEach(agent -> products.addAll(agent.getProductsAssociated()));
        products.addAll(productsByStock);
        return products.parallelStream()
                .map(product -> {
                    String serialNumbersExpired = product.getSerialNumber();
                    Date dueDate;
                    String agentAsignedToo = "";
                    if (product.getAgentProd() != null) {
                        dueDate = Date.from(product.getAgentProd().getDuesoldDate().atStartOfDay(ZoneId.systemDefault()).toInstant());
                        agentAsignedToo = product.getAgentProd().getFirstname() + " " + product.getAgentProd().getLastname();
                    } else {
                        dueDate = Date.from(product.getStock().getDueDate().atStartOfDay(ZoneId.systemDefault()).toInstant());
                    }
                    return createReclamationDto(serialNumbersExpired, dueDate, managers, agentAsignedToo);
                })
                .collect(Collectors.toList());
    }


    private List<Userdto> getAllmanagers() {
        String token = tokenFetcher.getToken();
        List<Userdto> userdtos = webClientBuilder.build().get()
                .uri("http://keycloakuser-service/people/allusers")
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .retrieve()
                .bodyToFlux(Userdto.class)
                .collectList()
                .block();
        assert userdtos != null;
        List<Userdto> managers = userdtos.stream()
                .filter(userdto -> userdto.getRealmRoles().contains("MANAGER") || userdto.getRealmRoles().contains("IMANAGER"))
                    .collect(Collectors.toList());
        return managers;
    }
    private ReclamationDto createReclamationDto(String serialNumbersExpired, Date dueDate, List<Userdto> managers, String agentAsignedToo) {
        List<String> usernames = managers.stream()
                    .map(Userdto::getUsername).toList();
        SimpleDateFormat sdf = new SimpleDateFormat("dd MMM, yyyy", Locale.ENGLISH);
        String formattedDueDate = sdf.format(dueDate);
        Date now = new Date();
        long differenceMillis = dueDate.getTime() - now.getTime();
        long differenceDays = (differenceMillis / (1000 * 60 * 60 * 24)) + 1;
        ReclamationDto reclamationDto = new ReclamationDto();
        reclamationDto.setSenderReference("PhoenixStock Keeper");
        reclamationDto.setReclamationText("The expiration date for this product " +
                                           "'"+serialNumbersExpired+"'" +
                                            " assigned to " +
                                            agentAsignedToo +
                                            " in " +
                                           + differenceDays +
                                          " day(s). " +
                                          " Please check the situation, the product will expire on " +
                                          formattedDueDate);
        reclamationDto.setReceiverReference(usernames);
        reclamationDto.setReclamationType(ReclamType.stockExpirationReminder);
        return reclamationDto;
    }

    @Override
    public Page<ProductDto> getProductsReturnedPaginatedByusername(Pageable pageable, String username) {
        List<AgentProd> agentProds = iAgentProdRepository.findByUsername(username);
        List<Product> products = new ArrayList<>();
        for (AgentProd agentProd: agentProds){
            Optional<Product> optionalProduct = iProductRepository.findByAgentReturnedProd(agentProd);
            if(optionalProduct.isPresent()){
                Product product = optionalProduct.get();
                products.add(product);
            }
        }
        if(products.isEmpty()){
            for (AgentProd agentProd: agentProds){
                Optional<Product> optionalProduct = iProductRepository.findByManagerProd(agentProd);
                if(optionalProduct.isPresent()){
                    Product product = optionalProduct.get();
                    products.add(product);
                }
            }
        }
        List<ProductDto> productDtos = products.stream()
                .filter(Product::isReturned)
                .map(iProductMapper::toDto)
                .collect(Collectors.toList());
        for (int i = 0; i < productDtos.size(); i++) {
            Product product = products.get(i);
            ProductDto productDto = productDtos.get(i);
                if (product.getStock() != null) {
                    StockDto stockDto = iStockMapper.toDto(product.getStock());
                    Campaigndto campaigndto = webClientBuilder.build().get()
                            .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", product.getStock().getCampaignRef())
                            .retrieve()
                            .bodyToMono(Campaigndto.class)
                            .block();
                    stockDto.setCampaigndto(campaigndto);
                    productDto.setStock(stockDto);
                }
                if (product.getAgentProd() != null) {
                    AgentProdDto agentProdDto = iAgentProdMapper.toDto(product.getAgentProd());
                    productDto.setAgentProd(agentProdDto);
                }
                if (product.getAgentReturnedProd() != null) {
                    AgentProdDto agentReturnedProd = iAgentProdMapper.toDto(product.getAgentReturnedProd());
                    productDto.setAgentReturnedProd(agentReturnedProd);
                }
                if (product.getAgentwhoSoldProd() != null) {
                    AgentProdDto agentwhoSoldProd = iAgentProdMapper.toDto(product.getAgentwhoSoldProd());
                    productDto.setAgentwhoSoldProd(agentwhoSoldProd);
                }
                if (product.getManagerProd() != null) {
                    AgentProdDto managerProdDto = iAgentProdMapper.toDto(product.getManagerProd());
                    productDto.setManagerProd(managerProdDto);
                }
        }
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

        return productDtos;
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
        List<AgentProd> agentProds = iAgentProdRepository.findByUsername(username);
        int associatedProducts = 0;
        int returneddProducts = 0;
        int soldProducts = 0;
        for (AgentProd agentProd : agentProds) {
            Optional<Product> optionalReturnedProduct = iProductRepository.findByAgentReturnedProd(agentProd);
            if (!optionalReturnedProduct.isPresent()) {
                optionalReturnedProduct = iProductRepository.findByManagerProd(agentProd);
            }
            if (optionalReturnedProduct.isPresent()) {
                Product returnedproduct = optionalReturnedProduct.get();
                if(returnedproduct.isReturned()){
                    returneddProducts++;
                }
            }
            Optional<Product> optionalAssociatedProduct = iProductRepository.findByAgentProd(agentProd);
            if (!optionalAssociatedProduct.isPresent()) {
                optionalAssociatedProduct = iProductRepository.findByManagerProd(agentProd);
            }
            if (optionalAssociatedProduct.isPresent()) {
                Product associatedProduct = optionalAssociatedProduct.get();
                if(!associatedProduct.isReturned()) {
                    associatedProducts++;
                }
            }
            Optional<SoldProduct> optionalSoldProduct = iSoldProductRepository.findByAgentWhoSold(agentProd);
            if (!optionalSoldProduct.isPresent()) {
                optionalSoldProduct = iSoldProductRepository.findByManagerSoldProd(agentProd);
            }
            if (optionalSoldProduct.isPresent()) {
                soldProducts++;
            }
        }
        List<Integer> statList = new ArrayList<>();
        statList.add(associatedProducts);
        statList.add(returneddProducts);
        statList.add(soldProducts);

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
            float growthRate = ((float) countReturnedProductsCurrentMonth - countReturnedProductsPreviousMonth) / countReturnedProductsPreviousMonth * 100;
            if (countReturnedProductsCurrentMonth == 0) {
                statistics.put("countReturnedProductsCurrentMonth", (float) countReturnedProductsCurrentMonth);
                statistics.put("growthRate", -100f);
            } else if (countReturnedProductsPreviousMonth == 0) {
                statistics.put("countReturnedProductsCurrentMonth", (float) countReturnedProductsCurrentMonth);
                statistics.put("growthRate", 100f);
            } else {
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


}
