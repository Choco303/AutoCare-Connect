package com.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data // Generates getters, setters, equals, hashcode, and toString
@NoArgsConstructor // Generates a no-arguments constructor
@AllArgsConstructor // Generates an all-arguments constructor
@Builder // Enables the builder pattern for creating instances
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reviewer_name", nullable = false)
    private String reviewerName;

    @Column(name = "review_text", nullable = false, length = 300)
    private String reviewText;

    @Column(nullable = false)
    private int rating;

    @Column(name = "review_date", nullable = false)
    private LocalDateTime reviewDate = LocalDateTime.now();
}