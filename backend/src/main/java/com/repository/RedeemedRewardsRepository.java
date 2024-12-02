package com.repository;

import com.model.RedeemedRewards;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RedeemedRewardsRepository extends JpaRepository<RedeemedRewards, Long> {

    Optional<RedeemedRewards> findByCustomerId(Long customerId);
}
