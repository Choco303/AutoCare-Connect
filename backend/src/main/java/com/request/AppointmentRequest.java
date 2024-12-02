package com.request;

import lombok.Data;
import java.time.LocalDateTime;

import java.util.List;

@Data
public class AppointmentRequest {
    private String carMake;
    private String carModel;
    private Integer carYear;
    private String serviceName;
    private String estimatedTime;
    private String resources;
    private LocalDateTime appointmentDate;
    private List<Long> selectedRewardIds;
    private String selectedReward;

    // Getters and setters
}

