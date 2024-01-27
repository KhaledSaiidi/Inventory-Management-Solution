package com.phoenix.services;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import com.phoenix.dto.ProductDto;
import com.phoenix.mapper.IProductMapper;
import com.phoenix.mapper.IStockMapper;
import com.phoenix.model.*;
import com.phoenix.repository.IProductRepository;
import com.phoenix.repository.IStockRepository;
import com.phoenix.repository.IUncheckHistoryRepository;
import lombok.Data;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.math.BigDecimal;
import java.time.LocalDate;
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
    private IStockRepository iStockRepository;

    @Autowired
    private IUncheckHistoryRepository iUncheckHistoryRepository;


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
    public ProductDto UpdateProduct(String serialNumber, ProductDto productDto) {
        Product product = iProductRepository.findById(serialNumber).orElse(null);
        Stock stock = product.getStock();
        BigDecimal tochangeValue = BigDecimal.ZERO;
        if (product == null) {
            return null;
        }
        if (productDto.getProductType() != null) {
            product.setProductType(productDto.getProductType());}
        if (productDto.getProdName() != null) {
            product.setProdName(productDto.getProdName());}
        if (productDto.getBrand() != null) {
            product.setBrand(productDto.getBrand());}
        if (productDto.getProdDescription() != null) {
            product.setProdDescription(productDto.getProdDescription());}
        if (productDto.getState() != null) {
            product.setState(productDto.getState());}
        if (productDto.getSoldDate() != null) {
            product.setSoldDate(productDto.getSoldDate());}
        if (productDto.getPrice() != null) {
            tochangeValue = product.getPrice();
            product.setPrice(productDto.getPrice());}
        Product savedproduct = iProductRepository.save(product);
        stock.setStockValue(stock.getStockValue().subtract(tochangeValue).add(product.getPrice()));
        iStockRepository.save(stock);
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
        return productDto;
    }



    @Override
    public List<String> uploadProducts(MultipartFile file, String stockReference) throws IOException {


        Set<String> serialNumbers = parseCsv(file);
        List<String> notFoundserialNumbers = new ArrayList<>();
        Optional<Stock> stockOptional = iStockRepository.findById(stockReference);
        if(stockOptional.isPresent()) {
            Stock stock = stockOptional.get();
            List<Product> products = iProductRepository.findByStock(stock);
            for (String serial : serialNumbers) {
                boolean found = false;
                for (Product product : products) {
                    if (product.getSerialNumber().equalsIgnoreCase(serial)) {
                        product.setChecked(true);
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
                if (!product.isChecked()) {
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

    private Set<String> parseCsv(MultipartFile file) throws IOException {
        try(Reader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))){
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
                    .map(SerialNumbersCsvRepresentation::getSerialNumber)
                    .filter(serialNumber -> !serialNumber.isEmpty())
                    .collect(Collectors.toSet());
        }
    }
}
