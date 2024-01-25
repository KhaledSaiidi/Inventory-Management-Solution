package com.phoenix.controller;

import com.phoenix.dto.ProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.model.Product;
import com.phoenix.model.UncheckHistory;
import com.phoenix.services.IProductService;
import com.phoenix.services.IStockService;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

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

    @PutMapping("/updateProduct/{serialNumber}")
    public ProductDto updateProduct(@PathVariable String serialNumber, @RequestBody ProductDto productDto) {
        iProductService.UpdateProduct(serialNumber,productDto);
        return productDto;
    }

    @GetMapping("getProductByserialNumber/{serialNumber}")
    public ProductDto getProductByserialNumber(@PathVariable String serialNumber) {
        ProductDto productDto = iProductService.getProductByserialNumber(serialNumber);
        return productDto;
    }

    @PostMapping(value = "/uploadcsv/{stockReference}", consumes = {"multipart/form-data"})
    public List<String> uploadProducts(
            @PathVariable String stockReference,
            @RequestPart("file")MultipartFile file
            )throws IOException {
        return iProductService.uploadProducts(file, stockReference);
    }

    @GetMapping("getUncheckedHistorybyStockreference/{stockreference}")
    public List<UncheckHistory> getUncheckedHistorybyStockreference(@PathVariable String stockreference) {
        List<UncheckHistory> uncheckHistories = iStockService.getUncheckedHistorybyStockreference(stockreference);
        return uncheckHistories;
    }

}
