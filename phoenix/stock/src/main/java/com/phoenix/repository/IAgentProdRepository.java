package com.phoenix.repository;

import com.phoenix.model.AgentProd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IAgentProdRepository extends JpaRepository<AgentProd , String> {
    List<AgentProd> findByUsername(String username);
    @Query("SELECT DISTINCT s FROM AgentProd s LEFT JOIN FETCH s.productsAssociated WHERE s.duesoldDate BETWEEN :currentDate AND :sevenDaysLater")
    List<AgentProd> findAgentsDueWithinSevenDays(@Param("currentDate") LocalDate currentDate, @Param("sevenDaysLater") LocalDate sevenDaysLater);
}
