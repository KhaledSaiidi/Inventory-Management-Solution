package com.phoenix.archiverepo;

import com.phoenix.archivedmodel.ArchivedStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IArchivedStockRepo extends JpaRepository<ArchivedStock, String> {
}
