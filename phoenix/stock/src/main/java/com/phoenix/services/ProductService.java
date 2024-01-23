package com.phoenix.services;

import com.phoenix.dto.ProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.mapper.IProductMapper;
import com.phoenix.mapper.IStockMapper;
import com.phoenix.model.Product;
import com.phoenix.model.State;
import com.phoenix.model.Stock;
import com.phoenix.repository.IProductRepository;
import com.phoenix.repository.IStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

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

}
