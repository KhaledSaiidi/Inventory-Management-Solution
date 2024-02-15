package com.phoenix.repository;

import com.phoenix.model.AgentProd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IAgentProdRepository extends JpaRepository<AgentProd , String> {
    List<AgentProd> findByUsername(String username);

}
