package com.phoenix.services;

import com.phoenix.dto.AgentProdDto;
import com.phoenix.dto.ProductDto;
import com.phoenix.dto.SoldProductDto;
import com.phoenix.dto.TopSalesDto;
import com.phoenix.dtokeycloakuser.UserMysqldto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface IsoldProductService {
    void sellProduct(String ProdRef, AgentProdDto agentsoldProdDto);
    Page<SoldProductDto> getSoldProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm);

    Page<SoldProductDto> getSoldProductsByusername(Pageable pageable, String username);
    void uploadcsvTocheckSell(MultipartFile file, String stockReference) throws IOException;
    Map<String, Integer> getSoldProductsInfosBystockReference(String stockreference);
    void returnProduct(String prodRef, AgentProdDto returnagentProd);
    List<SoldProductDto> getThelast2SoldProdsByusername(String username);
    List<TopSalesDto> getlastMonthlySoldProds();
    Map<String, Float> getSoldProductsStatistics();
    List<Integer> getProductsSoldCount();
    void deleteSoldProduct(String ref);

    List<SoldProductDto> getThelast4SoldProdsByusername(String username);
    Page<SoldProductDto> getSoldProductsPaginated(Pageable pageable, String searchTerm);

}
