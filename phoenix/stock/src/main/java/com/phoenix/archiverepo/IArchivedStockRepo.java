package com.phoenix.archiverepo;

import com.phoenix.archivedmodel.ArchivedStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IArchivedStockRepo extends JpaRepository<ArchivedStock, String> {
   Optional<List<ArchivedStock>> findByCampaignRef(String ref);
}
