package com.phoenix.controller;

import com.phoenix.dto.ProductDto;
import com.phoenix.dto.StockDto;
import com.phoenix.model.Product;
import com.phoenix.model.Stock;
import com.phoenix.model.UncheckHistory;
import com.phoenix.repository.IStockRepository;
import com.phoenix.services.IProductService;
import com.phoenix.services.IStockService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
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
    public ResponseEntity<Page<StockDto>> getStocksAndCampaigns(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<StockDto> stockPage = iStockService.getStocks(searchTerm, pageable);
        return ResponseEntity.ok(stockPage);
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
    @GetMapping("getProductsPaginatedByStockReference/{stockreference}")
    public ResponseEntity<Page<ProductDto>> getProductsPaginatedByStockReference(
            @PathVariable String stockreference,
            @RequestParam int page,
            @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDto> productPage = iProductService.getProductsPaginatedBystockReference(pageable, stockreference);
        return ResponseEntity.ok(productPage);
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

    @PutMapping("/UpdateStock/{reference}")
    public StockDto UpdateStock(@PathVariable String reference, @RequestBody StockDto stockDto) {
        iStockService.UpdateStock(reference,stockDto);
        return stockDto;
    }

    @GetMapping("returnstockBycampaignRef/{campreference}")
    public List<StockDto> getStocksByCampaignRef(@PathVariable String campreference) {
        return iStockService.getStocksByCampaignRef(campreference);
    }

    @PostMapping(value = "/addProductsByupload/{stockReference}", consumes = {"multipart/form-data"})
    public ResponseEntity<Integer> addProductsByupload(
            @PathVariable String stockReference,
            @RequestPart("file") MultipartFile file
    )throws IOException {
        return ResponseEntity.ok(iProductService.addProductsByupload(file, stockReference));
    }

}
