package com.phoenix.repository;

import com.phoenix.model.UserMysql;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserMysqlRepository extends JpaRepository<UserMysql, String> {
    boolean existsByUsername(String username);
    Optional<UserMysql> findByUsername(String username);

}
