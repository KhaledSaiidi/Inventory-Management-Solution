package com.phoenix.mapperToArchive;

import com.phoenix.archivedmodel.ArchivedStock;
import com.phoenix.model.Stock;

public interface IStockToArchivedStock {
    ArchivedStock toArchive (Stock stock);
}
