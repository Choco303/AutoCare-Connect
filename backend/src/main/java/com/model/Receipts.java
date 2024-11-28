package com.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;

@Entity
@Table(name = "receipts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Receipts {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Auto-incremented primary key

    @Column(name = "receipt_id", nullable = false, unique = true)
    private String receiptId; // Unique identifier but not the primary key

    @Column(name = "car_details", nullable = false)
    private String carDetails;

    @Column(name = "task", nullable = false)
    private String task;

    @Column(name = "service_date", nullable = false)
    private LocalDate serviceDate;

    @Column(name = "time_taken", nullable = false)
    private String timeTaken;

    @Column(name = "mechanic_username", nullable = false)
    private String mechanicUsername;

    @Column(name = "username", nullable = false)
    private String username;
}
