package com.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentId;

    @Column(nullable = false)
    private Long customerId;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String carMake;

    @Column(nullable = false)
    private String carModel;

    @Column(nullable = false)
    private int carYear;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private LocalDateTime appointmentDate;

    @Column(name = "formatted_appointment_time", nullable = false)
    private String formattedAppointmentTime;

    @Column(nullable = false)
    private String estimatedTime;

    @Column(nullable = false)
    private String resources;

    @Column(nullable = false, unique = true, length = 6)
    private String receiptId;

    @Column(name = "mechanic_username")
    private String mechanicUsername;

    @Column(name = "cost", nullable = true)
    private Double cost;

    @Column(columnDefinition = "TEXT")
    private String selectedRewards;


}
