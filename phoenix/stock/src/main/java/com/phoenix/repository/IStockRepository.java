package com.phoenix.repository;

import com.phoenix.dto.StockDto;
import com.phoenix.model.Stock;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IStockRepository extends JpaRepository<Stock, String>{
    Optional<List<Stock>> findByCampaignRef(String campaignreference);
}
