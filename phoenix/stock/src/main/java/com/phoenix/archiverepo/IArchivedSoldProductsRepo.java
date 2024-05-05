package com.phoenix.archiverepo;

import com.phoenix.archivedmodel.ArchivedSoldProducts;
import com.phoenix.archivedmodel.ArchivedStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IArchivedSoldProductsRepo extends JpaRepository<ArchivedSoldProducts, String> {
    List<ArchivedSoldProducts> findByStock(ArchivedStock stock);

}
