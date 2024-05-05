package com.phoenix.archiveServices;

import com.phoenix.archiverepo.IArchivedSoldProductsRepo;
import com.phoenix.mapperToArchive.ISoldProdToArchivedSoldProd;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArchivedSoldProductsService implements IArchivedSoldProductsService{

    private final IArchivedSoldProductsRepo iArchivedSoldProductsRepo;
    private final ISoldProdToArchivedSoldProd iSoldProdToArchivedSoldProd;
}
