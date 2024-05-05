package com.phoenix.mapperToArchive;

import com.phoenix.archivedmodel.ArchivedProducts;
import com.phoenix.model.Product;

public interface IProdToArchivedProd {
    ArchivedProducts toarchive (Product product);
}
