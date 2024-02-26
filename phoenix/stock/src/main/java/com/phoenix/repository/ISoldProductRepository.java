package com.phoenix.repository;

import com.phoenix.model.SoldProduct;
import com.phoenix.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ISoldProductRepository extends JpaRepository<SoldProduct, String>  {

    List<SoldProduct> findByStock(Stock stock);
    }

