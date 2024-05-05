package com.phoenix.archiveServices;

import com.phoenix.archiverepo.IArchivedProductsRepo;
import com.phoenix.mapperToArchive.IProdToArchivedProd;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArchivedProductsService implements IArchivedProductsService {
    private final IArchivedProductsRepo iArchivedProductsRepo;
    private final IProdToArchivedProd iProdToArchivedProd;

}
