package com.repository;

import com.model.Receipts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReceiptsRepository extends JpaRepository<Receipts, Long> {
    // Fetch all receipts sorted by service date in descending order
    List<Receipts> findAllByOrderByServiceDateDesc();

    // Fetch the latest 6 receipts sorted by service date in descending order
    List<Receipts> findTop6ByOrderByServiceDateDesc();

    // Fetch receipts by car details
    List<Receipts> findByCarDetailsContainingIgnoreCase(String carDetails);

    // Fetch receipts by task
    List<Receipts> findByTaskContainingIgnoreCase(String task);

    List<Receipts> findByMechanicUsername(String mechanicUsername);

    List<Receipts> findByUsername(String username);

}
