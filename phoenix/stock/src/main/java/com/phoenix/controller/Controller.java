package com.phoenix.controller;

import com.phoenix.dto.ProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.services.IProductService;
import com.phoenix.services.IStockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
public class Controller {
    @Autowired
    IStockService iStockService;
    @Autowired
    IProductService iProductService;

    @PostMapping("/addStock/{campaignReference}")
    public ResponseEntity<StockDto> addStock(@PathVariable("campaignReference") String campaignReference, @RequestBody StockDto stockdto) {
        iStockService.addStock(stockdto, campaignReference);
        return ResponseEntity.ok(stockdto);
    }

    @GetMapping("/getStocksWithTheirCampaigns")
    public List<StockDto> getStocksAndCampaigns() {
        return iStockService.getstocks();
    }

    @PostMapping("/addProduct")
    public ResponseEntity<ProductDto> addProduct(@RequestBody ProductDto productDto) {
        iProductService.addProduct(productDto);
        return ResponseEntity.ok(productDto);
    }

    @GetMapping("getStockByReference/{reference}")
    public ResponseEntity<StockDto> getStockByReference(@PathVariable String reference) {
        StockDto stockDto = iStockService.getstockByReference(reference);
        if (stockDto != null) {
            return ResponseEntity.ok(stockDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("getProductsByStockReference/{stockreference}")
    public List<ProductDto> getProductsByStockReference(@PathVariable String stockreference) {
        List<ProductDto> productDtos = iProductService.getProductsBystockReference(stockreference);
        return productDtos;
    }

}
