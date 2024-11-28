package com.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@Entity
@Table(name = "redeemed_rewards")
public class RedeemedRewards {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_id", nullable = false, unique = true)
    private Long customerId;

    @Column(name = "redeemed_rewards", columnDefinition = "JSON", nullable = false)
    private String redeemedRewards; // Store JSON as a string

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Add the required constructor
    public RedeemedRewards(Long customerId, String redeemedRewards) {
        this.customerId = customerId;
        this.redeemedRewards = redeemedRewards;
    }
}
