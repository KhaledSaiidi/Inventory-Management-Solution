package com.phoenix.archiveServices;

import com.phoenix.archivedmodeldto.ArchivedProductsDTO;
import com.phoenix.archivedmodeldto.ArchivedSoldProductsDTO;
import com.phoenix.archivedmodeldto.ArchivedStockDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IArchivedService {
    void archiveStock(String campaignref);
    List<ArchivedStockDTO> archivedStocks(String campaignref);
    Page<ArchivedProductsDTO> getReturnedArchivedProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm);
    Page<ArchivedProductsDTO> getArchivedProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm);
    Page<ArchivedSoldProductsDTO> getArchivedSoldProductsPaginatedBystockReference(Pageable pageable, String stockreference, String searchTerm);
    void deletearchive(String campaignReference);

}
