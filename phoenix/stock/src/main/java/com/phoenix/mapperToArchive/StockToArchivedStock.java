package com.phoenix.mapperToArchive;

import com.phoenix.archivedmodel.ArchivedStock;
import com.phoenix.model.Stock;
import org.springframework.stereotype.Service;

@Service
public class StockToArchivedStock implements IStockToArchivedStock{

    @Override
    public ArchivedStock toArchive (Stock stock){
        ArchivedStock archivedStock = new ArchivedStock();
        archivedStock.setStockReference(stock.getStockReference());
        archivedStock.setProductTypes(stock.getProductTypes());
        archivedStock.setCampaignRef(stock.getCampaignRef());
        archivedStock.setShippingDate(stock.getShippingDate());
        archivedStock.setReceivedDate(stock.getReceivedDate());
        archivedStock.setDueDate(stock.getDueDate());
        archivedStock.setChecked(stock.isChecked());
        archivedStock.setNotes(stock.getNotes());
        archivedStock.setStockValue(stock.getStockValue());
        return archivedStock;
    }
}
