package com.phoenix.repository;

import com.phoenix.model.SoldProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISoldProductRepository extends JpaRepository<SoldProduct, String>  {


    }

