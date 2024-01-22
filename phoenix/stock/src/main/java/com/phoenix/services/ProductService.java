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
        product.setStock(stock);
        iProductRepository.save(product);
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

}
