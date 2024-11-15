package com.repository;

import com.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // Fetch the latest 6 reviews sorted by review date in descending order
    List<Review> findTop6ByOrderByReviewDateDesc();
}
