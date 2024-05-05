package com.phoenix.archiverepo;

import com.phoenix.archivedmodel.ArchivedProducts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IArchivedProductsRepo extends JpaRepository<ArchivedProducts, String> {
}
