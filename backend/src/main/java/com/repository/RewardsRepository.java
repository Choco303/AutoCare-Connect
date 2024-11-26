package com.repository;

import com.model.Rewards;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RewardsRepository extends JpaRepository<Rewards, Long> {

    // Fetch rewards by customer ID
    List<Rewards> findByCustomerId(Long customerId);

    // Fetch rewards by customer username
    List<Rewards> findByCustomer_Username(String username); // Assuming Rewards has a ManyToOne relation to Customer
}
