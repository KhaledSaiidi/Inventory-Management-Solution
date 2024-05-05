package com.phoenix.archiveServices;

import com.phoenix.archiverepo.IArchivedStockRepo;
import com.phoenix.mapperToArchive.IStockToArchivedStock;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArchivedStockService implements IArchivedStockService{
    private final IArchivedStockRepo iArchivedStockRepo;
    private final IStockToArchivedStock iStockToArchivedStock;

}
