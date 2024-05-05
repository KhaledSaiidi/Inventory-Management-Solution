package com.phoenix.archiverepo;

import com.phoenix.archivedmodel.ArchivedSoldProducts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IArchivedSoldProductsRepo extends JpaRepository<ArchivedSoldProducts, String> {
}
