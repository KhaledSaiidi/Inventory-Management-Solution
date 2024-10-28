package com.phoenix.repository;

import com.phoenix.model.Stock;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.NamedEntityGraph;
import jakarta.persistence.NamedAttributeNode;

@Repository
public interface IStockRepository extends JpaRepository<Stock, String>{
    Optional<List<Stock>> findByCampaignRef(String campaignreference);
    @Query("SELECT s.stockReference, s.productTypes, s.campaignRef, s.shippingDate, s.receivedDate, s.dueDate, s.checked, s.notes, s.stockValue FROM Stock s")
    List<Object[]> findAllWithoutProductsData();
    default List<Stock> findAllWithoutProducts() {
        List<Object[]> resultList = findAllWithoutProductsData();
        List<Stock> stocks = new ArrayList<>();

        for (Object[] result : resultList) {
            Stock stock = new Stock();
            stock.setStockReference((String) result[0]);
            stock.setProductTypes((List<String>) result[1]);
            stock.setCampaignRef((String) result[2]);
            stock.setShippingDate((LocalDate) result[3]);
            stock.setReceivedDate((LocalDate) result[4]);
            stock.setDueDate((LocalDate) result[5]);
            stock.setChecked((boolean) result[6]);
            stock.setNotes((String) result[7]);
            stock.setStockValue((BigDecimal) result[8]);
            stock.setProducts(new ArrayList<>());
            stocks.add(stock);
        }

        return stocks;
    }

    @Query("SELECT s FROM Stock s WHERE s.dueDate BETWEEN :currentDate AND :sevenDaysLater OR s.dueDate < :currentDate")
    List<Stock> findStocksDueWithinSevenDays(@Param("currentDate") LocalDate currentDate, @Param("sevenDaysLater") LocalDate sevenDaysLater);

}
