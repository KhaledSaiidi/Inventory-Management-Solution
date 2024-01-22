package com.phoenix.repository;

import com.phoenix.model.Product;
import com.phoenix.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IProductRepository extends JpaRepository<Product, String> {
    List<Product> findByStock(Stock stock);

}
