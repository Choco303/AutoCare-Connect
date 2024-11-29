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

    // add points for customer
    public Rewards addPoints(Long customerId, int points) {
        Rewards rewards = rewardsRepository.findByCustomerId(customerId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No rewards found for customer ID: " + customerId));

        rewards.setTotalPoints(rewards.getTotalPoints() + points);
        return rewardsRepository.save(rewards);
    }

    // redeem rewards adjust every column
    public RedeemedRewards redeemReward(Long customerId, String rewardType, int rewardPoints) {
        Rewards rewards = rewardsRepository.findByCustomerId(customerId).stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No rewards found for customer ID: " + customerId));

        int remainingPoints = rewards.getTotalPoints() - rewards.getRedeemedPoints();
        if (remainingPoints < rewardPoints) {
            throw new IllegalArgumentException("Insufficient points to redeem this reward.");
        }

        rewards.setRedeemedPoints(rewards.getRedeemedPoints() + rewardPoints);
        rewardsRepository.save(rewards);

        RedeemedRewards redeemedRewards = redeemedRewardsRepository.findByCustomerId(customerId)
                .orElse(new RedeemedRewards(customerId, "[]"));

        List<Map<String, Object>> rewardsList;
        try {
            rewardsList = objectMapper.readValue(redeemedRewards.getRedeemedRewards(), new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse redeemed rewards JSON.", e);
        }

        Map<String, Object> newReward = Map.of(
                "rewardType", rewardType,
                "rewardPoints", rewardPoints,
                "redeemedAt", LocalDateTime.now().toString(),
                "isUsed", false
        );
        rewardsList.add(newReward);

        try {
            redeemedRewards.setRedeemedRewards(objectMapper.writeValueAsString(rewardsList));
        } catch (Exception e) {
            throw new RuntimeException("Failed to save redeemed rewards JSON.", e);
        }
        return redeemedRewardsRepository.save(redeemedRewards);
    }

    // show that rewards is redeemed
    public RedeemedRewards useRedeemedReward(Long customerId, String rewardType) {
        RedeemedRewards redeemedRewards = redeemedRewardsRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("No redeemed rewards found for customer ID: " + customerId));

        List<Map<String, Object>> rewardsList;
        try {
            rewardsList = objectMapper.readValue(redeemedRewards.getRedeemedRewards(), new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse redeemed rewards JSON.", e);
        }

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

        try {
            redeemedRewards.setRedeemedRewards(objectMapper.writeValueAsString(rewardsList));
        } catch (Exception e) {
            throw new RuntimeException("Failed to save redeemed rewards JSON.", e);
        }
        return redeemedRewardsRepository.save(redeemedRewards);
    }

    // get all redeemed rewards
    public List<Map<String, Object>> getRedeemedRewards(Long customerId) {
        RedeemedRewards redeemedRewards = redeemedRewardsRepository.findByCustomerId(customerId)
                .orElseThrow(() -> new RuntimeException("No redeemed rewards found for customer ID: " + customerId));

        try {
            return objectMapper.readValue(redeemedRewards.getRedeemedRewards(), new TypeReference<>() {});
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse redeemed rewards JSON.", e);
        }
    }

    // get rewards by customer id
    public List<Rewards> getRewardsByCustomerId(Long customerId) {
        return rewardsRepository.findByCustomerId(customerId);
    }

    // save the rewards
    public Rewards saveRewards(Rewards rewards) {
        if (rewards.getCustomer() == null || rewards.getCustomer().getId() == null) {
            throw new IllegalArgumentException("Customer information is missing for rewards.");
        }
        return rewardsRepository.save(rewards);
    }
}
