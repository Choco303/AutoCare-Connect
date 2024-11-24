package com.repository;

import com.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // Find customer by username and password
    Optional<Customer> findByUsernameAndPassword(String username, String password);

    // Find customer by username
    Optional<Customer> findByUsername(String username);
}
