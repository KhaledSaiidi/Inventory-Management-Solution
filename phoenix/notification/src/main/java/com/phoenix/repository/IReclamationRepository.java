package com.phoenix.repository;

import com.phoenix.model.Reclamation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IReclamationRepository extends JpaRepository<Reclamation, Long> {
}
