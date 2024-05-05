package com.phoenix.archiveMapper;

import com.phoenix.archivedmodel.ArchivedProducts;
import com.phoenix.archivedmodel.ArchivedSoldProducts;
import com.phoenix.archivedmodel.ArchivedStock;
import com.phoenix.archivedmodeldto.ArchivedProductsDTO;
import com.phoenix.archivedmodeldto.ArchivedSoldProductsDTO;
import com.phoenix.archivedmodeldto.ArchivedStockDTO;

import java.util.List;

public interface IArchivedMapper {
    ArchivedStockDTO todto(ArchivedStock archivedStock);
    List<ArchivedStockDTO> toDtoList(List<ArchivedStock> archivedStocks);
    ArchivedProductsDTO toArchiveProddto(ArchivedProducts archivedProducts);
    List<ArchivedProductsDTO> toarchivedProductsDtoList(List<ArchivedProducts> archivedProducts);
    ArchivedSoldProductsDTO toArchiveSoldProddto(ArchivedSoldProducts archivedSoldProducts);
    List<ArchivedSoldProductsDTO> toarchivedSoldProductsDtoList(List<ArchivedSoldProducts> archivedSoldProducts);
}
