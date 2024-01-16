package com.phoenix.repository;

import com.phoenix.model.Stock;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface IStockRepository extends JpaRepository<Stock, String>{
}
