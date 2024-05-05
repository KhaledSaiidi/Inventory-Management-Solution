package com.phoenix.archiveMapper;

import com.phoenix.archivedmodel.ArchivedProducts;
import com.phoenix.archivedmodel.ArchivedSoldProducts;
import com.phoenix.archivedmodel.ArchivedStock;
import com.phoenix.archivedmodeldto.ArchivedProductsDTO;
import com.phoenix.archivedmodeldto.ArchivedSoldProductsDTO;
import com.phoenix.archivedmodeldto.ArchivedStockDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArchivedMapper implements IArchivedMapper {
    @Override
    public ArchivedStockDTO todto(ArchivedStock archivedStock) {
        ArchivedStockDTO archivedStockDTO = new ArchivedStockDTO();
        archivedStockDTO.setStockReference(archivedStock.getStockReference());
        archivedStockDTO.setProductTypes(archivedStock.getProductTypes());
        archivedStockDTO.setCampaignRef(archivedStock.getCampaignRef());
        archivedStockDTO.setShippingDate(archivedStock.getShippingDate());
        archivedStockDTO.setReceivedDate(archivedStock.getReceivedDate());
        archivedStockDTO.setDueDate(archivedStock.getDueDate());
        archivedStockDTO.setChecked(archivedStock.isChecked());
        archivedStockDTO.setNotes(archivedStock.getNotes());
        archivedStockDTO.setStockValue(archivedStock.getStockValue());
        return archivedStockDTO;
    }
    @Override
    public List<ArchivedStockDTO> toDtoList(List<ArchivedStock> archivedStocks) {
        return archivedStocks.stream()
                .map(this::todto)
                .collect(Collectors.toList());
    }


    @Override
    public ArchivedProductsDTO toArchiveProddto(ArchivedProducts archivedProducts) {
        ArchivedProductsDTO archivedProductsDTO = new ArchivedProductsDTO();

        archivedProductsDTO.setSerialNumber(archivedProducts.getSerialNumber());
        archivedProductsDTO.setSimNumber(archivedProducts.getSimNumber());
        archivedProductsDTO.setBrand(archivedProducts.getBrand());
        archivedProductsDTO.setProductType(archivedProducts.getProductType());
        archivedProductsDTO.setProdName(archivedProducts.getProdName());
        archivedProductsDTO.setComments(archivedProducts.getComments());
        archivedProductsDTO.setPrice(archivedProducts.getPrice());
        archivedProductsDTO.setCheckedExistence(archivedProducts.isCheckedExistence());
        archivedProductsDTO.setCheckin(archivedProducts.getCheckin());
        archivedProductsDTO.setCheckout(archivedProducts.getCheckout());
        archivedProductsDTO.setBoxNumber(archivedProducts.getBoxNumber());
        archivedProductsDTO.setReturned(archivedProducts.isReturned());
        archivedProductsDTO.setReturnedstatus(archivedProducts.isReturnedstatus());
        archivedProductsDTO.setStockReference(archivedProducts.getStock().getStockReference());
        return archivedProductsDTO;
    }
    @Override
    public List<ArchivedProductsDTO> toarchivedProductsDtoList(List<ArchivedProducts> archivedProducts) {
        return archivedProducts.stream()
                .map(this::toArchiveProddto)
                .collect(Collectors.toList());
    }



    @Override
    public ArchivedSoldProductsDTO toArchiveSoldProddto(ArchivedSoldProducts archivedSoldProducts) {
        ArchivedSoldProductsDTO archivedSoldProductsDTO = new ArchivedSoldProductsDTO();

        archivedSoldProductsDTO.setSerialNumber(archivedSoldProducts.getSerialNumber());
        archivedSoldProductsDTO.setSimNumber(archivedSoldProducts.getSimNumber());
        archivedSoldProductsDTO.setBrand(archivedSoldProducts.getBrand());
        archivedSoldProductsDTO.setProductType(archivedSoldProducts.getProductType());
        archivedSoldProductsDTO.setProdName(archivedSoldProducts.getProdName());
        archivedSoldProductsDTO.setComments(archivedSoldProducts.getComments());
        archivedSoldProductsDTO.setPrice(archivedSoldProducts.getPrice());
        archivedSoldProductsDTO.setCheckedSell(archivedSoldProducts.isCheckedSell());
        archivedSoldProductsDTO.setSoldDate(archivedSoldProducts.getSoldDate());
        archivedSoldProductsDTO.setStockReference(archivedSoldProducts.getStock().getStockReference());
        return archivedSoldProductsDTO;
    }

    @Override
    public List<ArchivedSoldProductsDTO> toarchivedSoldProductsDtoList(List<ArchivedSoldProducts> archivedSoldProducts) {
        return archivedSoldProducts.stream()
                .map(this::toArchiveSoldProddto)
                .collect(Collectors.toList());
    }

}
