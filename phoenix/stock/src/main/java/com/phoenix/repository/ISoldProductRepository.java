package com.phoenix.repository;

import com.phoenix.model.AgentProd;
import com.phoenix.model.Product;
import com.phoenix.model.SoldProduct;
import com.phoenix.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ISoldProductRepository extends JpaRepository<SoldProduct, String>  {

    List<SoldProduct> findByStock(Stock stock);

    Optional<SoldProduct> findByAgentWhoSold(AgentProd agentProd);
    Optional<SoldProduct> findByManagerSoldProd(AgentProd agentProd);
    @Query("SELECT sp FROM SoldProduct sp WHERE FUNCTION('YEAR', sp.soldDate) = :year " +
            "AND FUNCTION('MONTH', sp.soldDate) = :month")
    List<SoldProduct> findMonthlySoldProducts(int year, int month);

    @Query("SELECT COUNT(sp) FROM SoldProduct sp WHERE MONTH(sp.soldDate) = MONTH(CURRENT_DATE)")
    long countSoldProductsCurrentMonth();

    @Query("SELECT COUNT(sp) FROM SoldProduct sp WHERE MONTH(sp.soldDate) = " +
            "CASE WHEN MONTH(CURRENT_DATE) = 1 THEN 12 ELSE MONTH(CURRENT_DATE) - 1 END")
    long countSoldProductsPreviousMonth();


    @Query("SELECT COUNT(sp) FROM SoldProduct sp " +
            "WHERE YEAR(sp.soldDate) = YEAR(CURRENT_DATE()) " +
            "AND MONTH(sp.soldDate) = :month")
    int countSoldProductsByMonth(@Param("month") int month);

    Optional<SoldProduct> findByAgentAssociatedProd(AgentProd agentProd);


}

