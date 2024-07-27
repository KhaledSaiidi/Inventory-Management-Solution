package com.phoenix.controller;

import com.phoenix.archiveServices.IArchivedService;
import com.phoenix.archivedmodeldto.ArchivedProductsDTO;
import com.phoenix.archivedmodeldto.ArchivedSoldProductsDTO;
import com.phoenix.archivedmodeldto.ArchivedStockDTO;
import com.phoenix.dto.*;
import com.phoenix.model.UncheckHistory;
import com.phoenix.services.IAgentProdService;
import com.phoenix.services.IProductService;
import com.phoenix.services.IStockService;
import com.phoenix.services.IsoldProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequiredArgsConstructor
public class Controller {
    @Autowired
    IStockService iStockService;
    @Autowired
    IProductService iProductService;
    @Autowired
    IAgentProdService iAgentProdService;
    @Autowired
    IsoldProductService isoldProductService;
    @Autowired
    IArchivedService archiveStock;


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

    @GetMapping("/getStockByReference/{reference}")
    public ResponseEntity<StockDto> getStockByReference(@PathVariable String reference) {
        StockDto stockDto = iStockService.getstockByReference(reference);
        if (stockDto != null) {
            return ResponseEntity.ok(stockDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getProductsByStockReference/{stockreference}")
    public List<ProductDto> getProductsByStockReference(@PathVariable String stockreference) {
        List<ProductDto> productDtos = iProductService.getProductsBystockReference(stockreference);
        return productDtos;
    }
    @GetMapping("/getProductsPaginatedByStockReference/{stockreference}")
    public ResponseEntity<Page<ProductDto>> getProductsPaginatedByStockReference(
            @PathVariable String stockreference,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDto> productPage = iProductService.getProductsPaginatedBystockReference(pageable, stockreference, searchTerm);
        return ResponseEntity.ok(productPage);
    }


    @PutMapping("/updateProduct/{serialNumber}")
    public ProductDto updateProduct(@PathVariable String serialNumber, @RequestBody ProductDto productDto) {
        iProductService.UpdateProduct(serialNumber,productDto);
        return productDto;
    }

    @GetMapping("/getProductByserialNumber/{serialNumber}")
    public ProductDto getProductByserialNumber(@PathVariable String serialNumber) {
        ProductDto productDto = iProductService.getProductByserialNumber(serialNumber);
        return productDto;
    }


    @GetMapping("/getUncheckedHistorybyStockreference/{stockreference}")
    public List<UncheckHistory> getUncheckedHistorybyStockreference(@PathVariable String stockreference) {
        List<UncheckHistory> uncheckHistories = iStockService.getUncheckedHistorybyStockreference(stockreference);
        return uncheckHistories;
    }

    @PutMapping("/UpdateStock/{reference}")
    public StockDto UpdateStock(@PathVariable String reference, @RequestBody StockDto stockDto) {
        iStockService.UpdateStock(reference,stockDto);
        return stockDto;
    }

    @GetMapping("/returnstockBycampaignRef/{campreference}")
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


    @PostMapping("/assignAgentsToProd")
    public void assignAgentAndManager(@RequestBody List<AgentProdDto> agentProdDtos) {
        AgentProdDto agentProd = null;
        AgentProdDto managerProd = null;
        for (AgentProdDto agent: agentProdDtos) {
            if(agent.isSeniorAdvisor()){managerProd = agent;}
            else {agentProd = agent;}
        }
        iAgentProdService.assignAgentandManager(agentProd, managerProd);
    }

    @GetMapping("/getProductsPaginatedByusername/{username}")
    public ResponseEntity<Page<ProductDto>> getProductsPaginatedByusername(
            @PathVariable String username,
            @RequestParam int page,
            @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDto> productPage = iProductService.getProductsPaginatedByusername(pageable, username);
        return ResponseEntity.ok(productPage);
    }

    @PutMapping("/UpdateAgentonProd/{agentRef}")
    public AgentProdDto UpdateAgentonProd(@PathVariable String agentRef, @RequestBody AgentProdDto agentProdDto) {
        return iAgentProdService.UpdateAgentonProd(agentRef, agentProdDto);
    }

    @DeleteMapping
    @RequestMapping("/detachAgentFromProduct/{serialNumber}")
    public void detachAgentFromProduct(@PathVariable String serialNumber) {
        iAgentProdService.detachAgentFromProduct(serialNumber);
    }

    @DeleteMapping
    @RequestMapping("/detachManagerFromProduct/{serialNumber}")
    public void detachManagerFromProduct(@PathVariable String serialNumber) {
        iAgentProdService.detachManagerFromProduct(serialNumber);
    }
    @GetMapping("/getAssignedByusername/{username}")
    public  List<AgentProdDto> getAssignedByusername(@PathVariable String username) {
        List<AgentProdDto> agentProdDtos = iAgentProdService.getAssignementByusername(username);
        return agentProdDtos;
    }

    @PutMapping("/UpdateAgentsbyUserssignementByusername")
    public void UpdateAgentsbyUserssignementByusername(@RequestBody List<AgentProdDto> agentProdDtos) {
        iAgentProdService.UpdateAgentsbyUserssignementByusername(agentProdDtos);
    }

    @GetMapping("/getStocksByStocksReferences")
    public List<String> getStocksByStocksReferences() {
        List<String> liststockreferences = iStockService.getAllstockReferences();
        return liststockreferences;
    }

    @PostMapping("/stockcheck/{stockReference}")
    public ResponseEntity<String> checkProducts(@PathVariable String stockReference, @RequestBody Set<String> prodsRef) {
        iProductService.checkProds(stockReference, prodsRef);
        return ResponseEntity.ok("Products checked successfully.");
    }


    @PostMapping("/sellProduct/{prodRef}")
    public ResponseEntity<AgentProdDto> sellProduct(@PathVariable("prodRef") String prodRef, @RequestBody AgentProdDto agentProdDto) {
        isoldProductService.sellProduct(prodRef, agentProdDto);
        return ResponseEntity.ok(agentProdDto);

    }


    @GetMapping("/getSoldProductsPaginatedByStockReference/{stockreference}")
    public ResponseEntity<Page<SoldProductDto>> getSoldProductsPaginatedByStockReference(
            @PathVariable String stockreference,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SoldProductDto> soldproductPage = isoldProductService.getSoldProductsPaginatedBystockReference(pageable, stockreference, searchTerm);
        return ResponseEntity.ok(soldproductPage);
    }

    @GetMapping("/getSoldProductsByusername/{username}")
    public ResponseEntity<Page<SoldProductDto>> getSoldProductsByusername(
            @PathVariable String username,
            @RequestParam int page,
            @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SoldProductDto> soldproductPage = isoldProductService.getSoldProductsByusername(pageable, username);
        return ResponseEntity.ok(soldproductPage);
    }


    @PostMapping(value = "/uploadcsvTocheckSell/{stockReference}", consumes = {"multipart/form-data"})
    public void uploadcsvTocheckSell(
            @PathVariable String stockReference,
            @RequestPart("file")MultipartFile file
    )throws IOException {
        isoldProductService.uploadcsvTocheckSell(file, stockReference);
    }

    @GetMapping("/products-info")
    public Map<String, Integer> getProductsInfoByStockReference(@RequestParam String stockReference) {
        return iProductService.getProductsInfosBystockReference(stockReference);
    }

    @GetMapping("/soldproducts-info")
    public Map<String, Integer> getsoldProductsInfoByStockReference(@RequestParam String stockReference) {
        return isoldProductService.getSoldProductsInfosBystockReference(stockReference);
    }


    @PostMapping("/returnProduct/{prodRef}")
    public void returnProduct(@PathVariable("prodRef") String prodRef ,@RequestBody AgentProdDto agentProdDto) {
        isoldProductService.returnProduct(prodRef, agentProdDto);

    }


    @GetMapping("/getReturnedProductsPaginatedByStockReference/{stockreference}")
    public ResponseEntity<Page<ProductDto>> getReturnedProductsPaginatedByStockReference(
            @PathVariable String stockreference,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDto> productPage = iProductService.getReturnedProductsPaginatedBystockReference(pageable, stockreference, searchTerm);
        return ResponseEntity.ok(productPage);
    }

    @PostMapping("/placeStock")
    public String placeStock(@RequestParam String body) {
        return iStockService.placeStock(body);
    }

    @GetMapping("/productsInPossession/{username}")
    public List<String> productsInPossession(@PathVariable String username) {
        return iAgentProdService.productsInPossession(username);
    }

    @GetMapping("/getProductsReturnedPaginatedByusername/{username}")
    public ResponseEntity<Page<ProductDto>> getProductsReturnedPaginatedByusername(
            @PathVariable String username,
            @RequestParam int page,
            @RequestParam int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDto> productPage = iProductService.getProductsReturnedPaginatedByusername(pageable, username);
        return ResponseEntity.ok(productPage);
    }
    @PutMapping("/checkReturn/{serialNumber}")
    public void checkReturn(@PathVariable("serialNumber") String serialNumber) {
        iProductService.checkReturn(serialNumber);
    }

    @GetMapping("/getThelast2ReturnedProdsByusername/{username}")
    public ResponseEntity<List<ProductDto>> getThelast2ReturnedProdsByusername(@PathVariable String username) {
        List<ProductDto> productDtos = iProductService.getThelast2ReturnedProdsByusername(username);
        if (productDtos != null) {
            return ResponseEntity.ok(productDtos);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getThelast2SoldProdsByusername/{username}")
    public ResponseEntity<List<SoldProductDto>> getThelast2SoldProdsByusername(@PathVariable String username) {
        List<SoldProductDto> soldProductDtos = isoldProductService.getThelast2SoldProdsByusername(username);
        if (soldProductDtos != null) {
            return ResponseEntity.ok(soldProductDtos);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getThelastMonthlyReturnedProds")
    public ResponseEntity<List<ProductDto>> getThelastMonthlyReturnedProds() {
        List<ProductDto> productDtos = iProductService.getThelastMonthlyReturnedProds();
        if (productDtos == null) {
            return ResponseEntity.ok(Collections.emptyList());
        } else {
            return ResponseEntity.ok(productDtos);
        }
    }

    @GetMapping("/getUserStat/{username}")
    public ResponseEntity<List<Integer>> getUserStat(@PathVariable String username) {
        List<Integer> userStat = iProductService.getUserStat(username);
        if (userStat != null) {
            return ResponseEntity.ok(userStat);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getlastMonthlySoldProds")
    public ResponseEntity<List<TopSalesDto>> getlastMonthlySoldProds() {
        List<TopSalesDto> salesByagentMap = isoldProductService.getlastMonthlySoldProds();
        if (salesByagentMap != null) {
            return ResponseEntity.ok(salesByagentMap);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/statistics")
    public Map<String, Float> getSoldProductsStatistics() {
        return isoldProductService.getSoldProductsStatistics();
    }

    @GetMapping("/getProductNumberNow")
    public int getProductNumberNow() {
        return iProductService.getProductNumberNow();
    }

    @GetMapping("/returnedProductStatistics")
    public Map<String, Float> getReturnedProductsStatistics() {
        return iProductService.getReturnedProductsStatistics();
    }

    @GetMapping("/getProductsSoldCount")
    public List<Integer> getProductsSoldCount() {
        return isoldProductService.getProductsSoldCount();
    }

    @GetMapping("/getProductsReturnedCount")
    public List<Integer> getProductsReturnedCount() {
        return iProductService.getProductsReturnedCount();
    }

    @DeleteMapping
    @RequestMapping("/deleteStock/{ref}")
    public void deleteStock(@PathVariable String ref) {
        iStockService.deleteStock(ref);
    }

    @DeleteMapping
    @RequestMapping("/deleteProduct/{ref}")
    public void deleteProduct(@PathVariable("ref") String ref) {
        iProductService.deleteProduct(ref);
    }

    @DeleteMapping
    @RequestMapping("/deleteSoldProduct/{ref}")
    public void deleteSoldProduct(@PathVariable("ref") String ref) {
        isoldProductService.deleteSoldProduct(ref);
    }


    @DeleteMapping
    @RequestMapping("/deleteUncheckedHistory/{id}")
    public void deleteUncheckedHistory(@PathVariable Long id) {
        iStockService.deleteUncheckedHistory(id);
    }

    @DeleteMapping
    @RequestMapping("/{stockreference}")
    public void deleteaLLUncheckedHistoryinStock(@PathVariable String stockreference) {
        iStockService.deleteaLLUncheckedHistoryinStock(stockreference);
    }

    @PostMapping("/archive/{campaignref}")
    public ResponseEntity<Void> archiveStock(@PathVariable String campaignref) {
        archiveStock.archiveStock(campaignref);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getArchivedStocksByCampaign/{reference}")
    public ResponseEntity<List<ArchivedStockDTO>> getArchivedStocksByCampaign(@PathVariable String reference) {
        List<ArchivedStockDTO> archivedStockDTOS = archiveStock.archivedStocks(reference);
        if (archivedStockDTOS != null) {
            return ResponseEntity.ok(archivedStockDTOS);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/getArchivedProductsPaginatedBystockReference/{stockreference}")
    public ResponseEntity<Page<ArchivedProductsDTO>> getArchivedProductsPaginatedBystockReference(
            @PathVariable String stockreference,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ArchivedProductsDTO> productPage = archiveStock.getArchivedProductsPaginatedBystockReference(pageable, stockreference, searchTerm);
        return ResponseEntity.ok(productPage);
    }


    @GetMapping("/getReturnedArchivedProductsPaginatedBystockReference/{stockreference}")
    public ResponseEntity<Page<ArchivedProductsDTO>> getReturnedArchivedProductsPaginatedBystockReference(
            @PathVariable String stockreference,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ArchivedProductsDTO> productPage = archiveStock.getReturnedArchivedProductsPaginatedBystockReference(pageable, stockreference, searchTerm);
        return ResponseEntity.ok(productPage);
    }

    @GetMapping("/getArchivedSoldProductsPaginatedBystockReference/{stockreference}")
    public ResponseEntity<Page<ArchivedSoldProductsDTO>> getArchivedSoldProductsPaginatedBystockReference(
            @PathVariable String stockreference,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ArchivedSoldProductsDTO> productPage = archiveStock.getArchivedSoldProductsPaginatedBystockReference(pageable, stockreference, searchTerm);
        return ResponseEntity.ok(productPage);
    }


    @DeleteMapping
    @RequestMapping("/deletearchive/{campaignReference}")
    public void deletearchive(@PathVariable String campaignReference) {
        archiveStock.deletearchive(campaignReference);
    }

    @DeleteMapping
    @RequestMapping("/deleteAgentwithUsername/{username}")
    public void deleteAgentwithUsername(@PathVariable("username") String username) {
        iAgentProdService.deleteAgentwithUsername(username);
    }


    @GetMapping("/getThelast4ReturnedProdsByusername/{username}")
    public ResponseEntity<List<ProductDto>> getThelast4ReturnedProdsByusername(@PathVariable String username) {
        List<ProductDto> productDtos = iProductService.getThelast4ReturnedProdsByusername(username);
        if (productDtos != null) {
            return ResponseEntity.ok(productDtos);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getThelast4SoldProdsByusername/{username}")
    public ResponseEntity<List<SoldProductDto>> getThelast4SoldProdsByusername(@PathVariable String username) {
        List<SoldProductDto> soldProductDtos = isoldProductService.getThelast4SoldProdsByusername(username);
        if (soldProductDtos != null) {
            return ResponseEntity.ok(soldProductDtos);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getAllProductsPaginated")
    public ResponseEntity<Page<ProductDto>> getAllProductsPaginated(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDto> productPage = iProductService.getProductsPaginated(pageable, searchTerm);
        return ResponseEntity.ok(productPage);
    }

    @GetMapping("/getAllReturnedProductsPaginated")
    public ResponseEntity<Page<ProductDto>> getAllReturnedProductsPaginated(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ProductDto> productPage = iProductService.getReturnedProductsPaginated(pageable, searchTerm);
        return ResponseEntity.ok(productPage);
    }
    @GetMapping("/getAllSoldProductsPaginated")
    public ResponseEntity<Page<SoldProductDto>> getAllSoldProductsPaginated(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam String searchTerm) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SoldProductDto> soldProductPage = isoldProductService.getSoldProductsPaginated(pageable, searchTerm);
        return ResponseEntity.ok(soldProductPage);
    }

}
