package com.request;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RewardRedemptionRequest {
    private String rewardType;
    private int rewardPoints;

}
