package com.phoenix.repository;

import com.phoenix.model.AgentProd;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IAgentProdRepository extends JpaRepository<AgentProd , String> {
    List<AgentProd> findByUsername(String username);
    @Query("SELECT s FROM Stock s WHERE s.dueDate BETWEEN :currentDate AND :sevenDaysLater")
    List<AgentProd> findAgentProdsDueWithinSevenDays(LocalDate currentDate, LocalDate sevenDaysLater);

}
