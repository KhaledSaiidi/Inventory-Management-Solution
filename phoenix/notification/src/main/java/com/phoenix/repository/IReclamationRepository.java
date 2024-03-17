package com.phoenix.repository;

import com.phoenix.model.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IReclamationRepository extends JpaRepository<Reclamation, Long> {
    @Query("SELECT r FROM Reclamation r WHERE :receiverReferences MEMBER OF r.receiverReference")
    List<Reclamation> findByReceiverReferenceContaining(@Param("receiverReferences") List<String> receiverReferences);
}
