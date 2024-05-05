package com.phoenix.mapperToArchive;

import com.phoenix.archivedmodel.ArchivedSoldProducts;
import com.phoenix.model.SoldProduct;

public interface ISoldProdToArchivedSoldProd {
    ArchivedSoldProducts toarchive (SoldProduct soldProduct);
}
