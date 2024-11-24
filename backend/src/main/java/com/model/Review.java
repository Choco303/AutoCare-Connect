package com.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Builder.Default
    @Column(name = "review_date", nullable = false)
    private LocalDateTime reviewDate = LocalDateTime.now(); // Default to now
}
