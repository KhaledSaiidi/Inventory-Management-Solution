package com.phoenix.archiverepo;

import com.phoenix.archivedmodel.ArchivedProducts;
import com.phoenix.archivedmodel.ArchivedStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IArchivedProductsRepo extends JpaRepository<ArchivedProducts, String> {

    List<ArchivedProducts> findByStockAndReturned(ArchivedStock archivedStock, boolean returned);

}
