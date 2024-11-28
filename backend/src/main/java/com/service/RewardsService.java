package com.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.model.Customer;
import com.model.RedeemedRewards;
import com.model.Rewards;
import com.repository.CustomerRepository;
import com.repository.RedeemedRewardsRepository;
import com.repository.RewardsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class RewardsService {

    @Autowired
    private RewardsRepository rewardsRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RedeemedRewardsRepository redeemedRewardsRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Check if a customer exists in the rewards table
    public boolean isCustomerInRewardsTable(Long customerId) {
        List<Rewards> rewardsList = rewardsRepository.findByCustomerId(customerId);
        return !rewardsList.isEmpty();
    }

    // Create rewards for a customer if they don't already exist
    public Rewards createRewardsForCustomer(Long customerId) {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found: " + customerId));

        Rewards newRewards = new Rewards();
        newRewards.setCustomer(customer);
        newRewards.setTotalPoints(0);
        newRewards.setRedeemedPoints(0);
        return rewardsRepository.save(newRewards);
    }

    // Add points to a customer's rewards
    public Rewards addPoints(Long customerId, int points) {
        Rewards rewards = rewardsRepository.findByCustomerId(customerId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No rewards found for customer ID: " + customerId));

        rewards.setTotalPoints(rewards.getTotalPoints() + points);
        return rewardsRepository.save(rewards);
    }

    // Redeem points for a reward and update the redeemed rewards JSON column
    public RedeemedRewards redeemReward(Long customerId, String rewardType, int rewardPoints) {
        // Fetch rewards for the customer
        Rewards rewards = rewardsRepository.findByCustomerId(customerId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No rewards found for customer ID: " + customerId));

        // Check if the customer has enough points to redeem the reward
        int remainingPoints = rewards.getTotalPoints() - rewards.getRedeemedPoints();
        if (remainingPoints < rewardPoints) {
            throw new IllegalArgumentException("Insufficient points to redeem this reward.");
        }

        // Deduct points
        rewards.setRedeemedPoints(rewards.getRedeemedPoints() + rewardPoints);
        rewardsRepository.save(rewards);

        // Fetch or create a redeemed rewards entry for the customer
        RedeemedRewards redeemedRewards = redeemedRewardsRepository.findByCustomerId(customerId)
                .orElse(new RedeemedRewards(customerId, "[]"));

        // Parse existing JSON
        List<Map<String, Object>> rewardsList;
        try {
            rewardsList = objectMapper.readValue(redeemedRewards.getRedeemedRewards(), new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse redeemed rewards JSON.", e);
        }

        // Add the new reward to the JSON list
        Map<String, Object> newReward = Map.of(
                "rewardType", rewardType,
                "rewardPoints", rewardPoints,
                "redeemedAt", LocalDateTime.now().toString(),
                "isUsed", false
        );
        rewardsList.add(newReward);

        // Save updated JSON back to the database
        try {
            redeemedRewards.setRedeemedRewards(objectMapper.writeValueAsString(rewardsList));
        } catch (Exception e) {
            throw new RuntimeException("Failed to save redeemed rewards JSON.", e);
        }
        return redeemedRewardsRepository.save(redeemedRewards);
    }

    // Mark a redeemed reward as used
    public RedeemedRewards useRedeemedReward(Long customerId, String rewardType) {
        // Fetch the redeemed rewards entry for the customer
        RedeemedRewards redeemedRewards = redeemedRewardsRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("No redeemed rewards found for customer ID: " + customerId));

        // Parse existing JSON
        List<Map<String, Object>> rewardsList;
        try {
            rewardsList = objectMapper.readValue(redeemedRewards.getRedeemedRewards(), new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse redeemed rewards JSON.", e);
        }

        // Mark the specified reward as used
        boolean rewardFound = false;
        for (Map<String, Object> reward : rewardsList) {
            if (reward.get("rewardType").equals(rewardType) && !(boolean) reward.get("isUsed")) {
                reward.put("isUsed", true);
                rewardFound = true;
                break;
            }
        }

        if (!rewardFound) {
            throw new RuntimeException("No unused reward found for the given type.");
        }

        // Save updated JSON back to the database
        try {
            redeemedRewards.setRedeemedRewards(objectMapper.writeValueAsString(rewardsList));
        } catch (Exception e) {
            throw new RuntimeException("Failed to save redeemed rewards JSON.", e);
        }
        return redeemedRewardsRepository.save(redeemedRewards);
    }

    // Get all redeemed rewards for a customer
    public List<Map<String, Object>> getRedeemedRewards(Long customerId) {
        RedeemedRewards redeemedRewards = redeemedRewardsRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("No redeemed rewards found for customer ID: " + customerId));

        // Parse JSON and return as a list of maps
        try {
            return objectMapper.readValue(redeemedRewards.getRedeemedRewards(), new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse redeemed rewards JSON.", e);
        }
    }

    // Get rewards for a customer by customer ID
    public List<Rewards> getRewardsByCustomerId(Long customerId) {
        return rewardsRepository.findByCustomerId(customerId);
    }

    // Save or update rewards for a customer
    public Rewards saveRewards(Rewards rewards) {
        if (rewards.getCustomer() == null || rewards.getCustomer().getId() == null) {
            throw new IllegalArgumentException("Customer information is missing for rewards.");
        }
        return rewardsRepository.save(rewards);
    }
}
