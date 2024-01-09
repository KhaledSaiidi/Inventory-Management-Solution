package com.phoenix.repository;

import com.phoenix.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IClientRepository extends JpaRepository<Client, String> {
    Optional<Client> findByReference(String reference);
    Optional<Client> findByCompanyName(String companyName);
}
