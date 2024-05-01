package com.phoenix.repository;

import com.phoenix.model.AgentProd;
import com.phoenix.model.Product;
import com.phoenix.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Repository
public interface IProductRepository extends JpaRepository<Product, String> {
    List<Product> findByStock(Stock stock);
    List<Product> findByStockAndReturned(Stock stock, boolean returned);

    Page<Product> findByStock(Stock stock, Pageable pageable);
    Optional<Product> findByAgentProd (AgentProd agentProd);
    Optional<Product> findByAgentReturnedProd (AgentProd agentProd);

    Optional<Product> findByManagerProd (AgentProd agentProd);
    List<Product> findByStockIn(List<Stock> stocksForAlert);

    Optional<Product> findByAgentwhoSoldProd(AgentProd agentProd);



    @Query("SELECT COUNT(rp) FROM Product rp WHERE MONTH(rp.checkin) = MONTH(CURRENT_DATE) AND rp.returned = true")
    long countReturnedProductsCurrentMonth();

    @Query("SELECT COUNT(rp) FROM Product rp WHERE MONTH(rp.checkin) = " +
            "CASE WHEN MONTH(CURRENT_DATE) = 1 THEN 12 ELSE MONTH(CURRENT_DATE) - 1 END AND rp.returned = true")
    long countReturnedProductsPreviousMonth();

    @Query("SELECT COUNT(p) FROM Product p " +
            "WHERE p.returned = true " +
            "AND YEAR(p.checkin) = YEAR(CURRENT_DATE()) " +
            "AND MONTH(p.checkin) = :month")
    int countReturnedProductsByMonth(@Param("month") int month);

}
