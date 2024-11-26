package com.controller;

import com.model.RedeemedRewards;
import com.model.Rewards;
import com.request.RewardRedemptionRequest;
import com.service.RewardsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rewards")
public class RewardsController {

    @Autowired
    private RewardsService rewardsService;

    // Get all rewards for a specific customer
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<Rewards> getRewardsByCustomer(@PathVariable Long customerId) {
        List<Rewards> rewardsList = rewardsService.getRewardsByCustomerId(customerId);
        if (rewardsList.isEmpty()) {
            return ResponseEntity.notFound().build(); // Return 404 if no rewards found
        }
        return ResponseEntity.ok(rewardsList.get(0)); // Assuming one rewards row per customer
    }

    // Add points to a customer's rewards
    @PutMapping("/add-points/{customerId}")
    public ResponseEntity<Rewards> addPoints(@PathVariable Long customerId, @RequestParam int points) {
        try {
            Rewards updatedRewards = rewardsService.addPoints(customerId, points);
            return ResponseEntity.ok(updatedRewards);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Handle invalid points input
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Handle missing customer data
        }
    }

    // Redeem a reward for a customer
    @PostMapping("/redeem/{customerId}")
    public ResponseEntity<RedeemedRewards> redeemReward(
            @PathVariable Long customerId,
            @RequestBody RewardRedemptionRequest redemptionRequest
    ) {
        try {
            RedeemedRewards redeemedReward = rewardsService.redeemReward(
                    customerId,
                    redemptionRequest.getRewardType(),
                    redemptionRequest.getRewardPoints()
            );
            return ResponseEntity.ok(redeemedReward);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Handle insufficient points or invalid data
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Handle missing customer or reward data
        }
    }

    // Get all redeemed rewards for a customer
    @GetMapping("/redeemed/{customerId}")
    public ResponseEntity<List<Map<String, Object>>> getRedeemedRewards(@PathVariable Long customerId) {
        try {
            List<Map<String, Object>> redeemedRewards = rewardsService.getRedeemedRewards(customerId);
            return ResponseEntity.ok(redeemedRewards); // Return redeemed rewards list
        } catch (RuntimeException e) {
            return ResponseEntity.ok(List.of()); // Return an empty list if no redeemed rewards found
        }
    }

    // Mark a redeemed reward as used
    @PutMapping("/use/{customerId}")
    public ResponseEntity<RedeemedRewards> useRedeemedReward(
            @PathVariable Long customerId,
            @RequestParam String rewardType
    ) {
        try {
            RedeemedRewards updatedRedeemedReward = rewardsService.useRedeemedReward(customerId, rewardType);
            return ResponseEntity.ok(updatedRedeemedReward);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Handle already used or invalid reward
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build(); // Handle missing redeemed reward
        }
    }

    // Create or update rewards for a customer
    @PostMapping
    public ResponseEntity<Rewards> createOrUpdateRewards(@RequestBody Rewards rewards) {
        try {
            Rewards savedRewards = rewardsService.saveRewards(rewards);
            return ResponseEntity.ok(savedRewards);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null); // Handle missing customer information
        }
    }
}
