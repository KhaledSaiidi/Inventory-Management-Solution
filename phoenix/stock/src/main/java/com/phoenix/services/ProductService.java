package com.phoenix.services;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import com.phoenix.config.CaseInsensitiveHeaderColumnNameMappingStrategy;
import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.dtokeycloakuser.Campaigndto;
import com.phoenix.mapper.IAgentProdMapper;
import com.phoenix.mapper.IProductMapper;
import com.phoenix.mapper.IStockMapper;
import com.phoenix.model.*;
import com.phoenix.repository.IAgentProdRepository;
import com.phoenix.repository.IProductRepository;
import com.phoenix.repository.IStockRepository;
import com.phoenix.repository.IUncheckHistoryRepository;
import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
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
    private IStockMapper iStockMapper;
    @Autowired
    private IAgentProdMapper iAgentProdMapper;

    private final WebClient.Builder webClientBuilder;

    @Autowired
    private IStockRepository iStockRepository;

    @Autowired
    private IUncheckHistoryRepository iUncheckHistoryRepository;
    @Autowired
    private IAgentProdRepository iAgentProdRepository;


    @Override
    public void addProduct(ProductDto productDto) {
        productDto.setState(State.notSoldProd);
        Product product = iProductMapper.toEntity(productDto);
        Stock stock = iStockMapper.toEntity(productDto.getStock());
        if (stock.getStockValue() == null) {
            stock.setStockValue(BigDecimal.ZERO);
        }
        product.setStock(stock);
        iProductRepository.save(product);
        stock.setStockValue(stock.getStockValue().add(product.getPrice()));
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
        List<Product> products  = iProductRepository.findByStock(stock);
        List<ProductDto> productDtos = iProductMapper.toDtoList(products);
        for (int i = 0; i < productDtos.size(); i++) {
            Product product = products.get(i);
            ProductDto productDto = productDtos.get(i);
            if(product.getAgentProd() != null){
                AgentProdDto agentProdDto = iAgentProdMapper.toDto(product.getAgentProd());
                productDto.setAgentProd(agentProdDto);
            }
            if(product.getManagerProd() != null){
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
        if (productDto.getAgentProd() != null) {
            return productDto.getSerialNumber().toLowerCase().contains(searchString)
                    || productDto.getSimNumber().toLowerCase().contains(searchString)
                    || productDto.getAgentProd().getFirstname().toLowerCase().contains(searchString)
                    || productDto.getAgentProd().getLastname().toLowerCase().contains(searchString);
        } else {
            return productDto.getSerialNumber().toLowerCase().contains(searchString)
                    || productDto.getSimNumber().toLowerCase().contains(searchString);
        }
    }

    @Override
    public ProductDto UpdateProduct(String serialNumber, ProductDto productDto) {
        Product product = iProductRepository.findById(serialNumber).orElse(null);
        Stock stock = product.getStock();
        BigDecimal tochangeValue = BigDecimal.ZERO;
        if (product == null) {return null;}
        if (productDto.getSimNumber() != null) {product.setSimNumber(productDto.getSimNumber());}
        if (productDto.getCheckout() != null) {product.setCheckout(productDto.getCheckout());}
        if (productDto.getCheckin() != null) {product.setCheckin(productDto.getCheckin());}
        if (productDto.getBoxNumber() != null) {product.setBoxNumber(productDto.getBoxNumber());}
        if (productDto.isCheckedSell()) {product.setCheckedSell(productDto.isCheckedSell());}
        if (productDto.getBrand() != null) {product.setBrand(productDto.getBrand());}
        if (productDto.getProductType() != null) {product.setProductType(productDto.getProductType());}
        if (productDto.getProdName() != null) {product.setProdName(productDto.getProdName());}
        if (productDto.getComments() != null) {product.setComments(productDto.getComments());}
        if (productDto.getPrice() != null) {product.setPrice(productDto.getPrice());}
        if (productDto.getState() != null) {product.setState(productDto.getState());}
        if (productDto.getSoldDate() != null) {product.setSoldDate(productDto.getSoldDate());}
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
        if(product.getAgentWhoSold() != null) {
            productDto.setAgentWhoSold(iAgentProdMapper.toDto(product.getAgentWhoSold()));
        }
        return productDto;
    }



    @Override
    public List<String> uploadProducts(MultipartFile file, String stockReference) throws IOException {
        Set<String> serialNumbers = parseCsvCheck(file);
        List<String> notFoundserialNumbers = new ArrayList<>();
        Optional<Stock> stockOptional = iStockRepository.findById(stockReference);
        if(stockOptional.isPresent()) {
            Stock stock = stockOptional.get();
            List<Product> products = iProductRepository.findByStock(stock);
            for (String serial : serialNumbers) {
                boolean found = false;
                for (Product product : products) {
                    if (product.getSerialNumber().equalsIgnoreCase(serial)) {
                        product.setCheckedExistence(true);
                        iProductRepository.save(product);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    notFoundserialNumbers.add(serial);
                }
            }
            List<Product> productsafterChange = iProductRepository.findByStock(stock);
            Boolean productsAreChecked = true;
            for (Product product : productsafterChange) {
                if (!product.isCheckedExistence()) {
                    productsAreChecked = false;
                    break;
                }
            }
            if (!notFoundserialNumbers.isEmpty()) {
                UncheckHistory uncheckHistory = new UncheckHistory();
                uncheckHistory.setNotFoundserialNumbers(notFoundserialNumbers);
                uncheckHistory.setStockreference(stockReference);
                uncheckHistory.setCheckDate(LocalDate.now());
                iUncheckHistoryRepository.save(uncheckHistory);
            }
            if (notFoundserialNumbers.isEmpty() && productsAreChecked) {
                stock.setChecked(true);
                iStockRepository.save(stock);
            }
        }
        return notFoundserialNumbers;
    }

    private Set<String> parseCsvCheck(MultipartFile file) throws IOException {
        try(Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))){
            CaseInsensitiveHeaderColumnNameMappingStrategy<SerialNumbersCsvRepresentation> strategy =
                    new CaseInsensitiveHeaderColumnNameMappingStrategy<>();
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
                    .map(SerialNumbersCsvRepresentation::getSerialNumber)
                    .filter(serialNumber -> !serialNumber.isEmpty())
                    .collect(Collectors.toSet());
        }
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
                            .state(State.notSoldProd)
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
        List<ProductDto> productDtos = iProductMapper.toDtoList(products);
        for (int i = 0; i < productDtos.size(); i++) {
            Product product = products.get(i);
            ProductDto productDto = productDtos.get(i);
            if(product.getStock() != null){
                StockDto stockDto = iStockMapper.toDto(product.getStock());
                Campaigndto campaigndto = webClientBuilder.build().get()
                        .uri("http://keycloakuser-service/people/getCampaignByReference/{campaignReference}", product.getStock().getCampaignRef())
                        .retrieve()
                        .bodyToMono(Campaigndto.class)
                        .block();
                stockDto.setCampaigndto(campaigndto);
                productDto.setStock(stockDto);
            }
            if(product.getAgentProd() != null){
                AgentProdDto agentProdDto = iAgentProdMapper.toDto(product.getAgentProd());
                productDto.setAgentProd(agentProdDto);
            }
            if(product.getManagerProd() != null){
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
                    stockchecked = false;
                }
            }
            if (stockchecked) {
                stock.setChecked(true);
            }
            iProductRepository.saveAll(productsTosave);
            iStockRepository.save(stock);
        }
    }

}
