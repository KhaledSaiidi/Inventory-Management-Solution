package com.phoenix.services;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;
import com.phoenix.dto.ProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.mapper.IProductMapper;
import com.phoenix.mapper.IStockMapper;
import com.phoenix.model.Product;
import com.phoenix.model.State;
import com.phoenix.model.Stock;
import com.phoenix.repository.IProductRepository;
import com.phoenix.repository.IStockRepository;
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
import java.util.List;
import java.util.Optional;
import java.util.Set;
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
    @Transactional(readOnly = true)
    public boolean checkProductBySerialNumber(String serialNumber) {
        // Check if a product with the given serial number exists in the database
        return iProductRepository.existsById(serialNumber);
    }
    @Override
    @Transactional
    public void updateProductCheckedStatus(String serialNumber, boolean checked) {
        // Update the 'checked' attribute of the product with the given serial number
        iProductRepository.findById(serialNumber).ifPresent(product -> {
            product.setChecked(checked);
            iProductRepository.save(product);
        });
    }

    @Override
    public Set<String> uploadProducts(MultipartFile file) throws IOException {
        Set<String> serialNumbers = parseCsv(file);
    return serialNumbers;
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
                    .collect(Collectors.toSet());
        }
    }
}
