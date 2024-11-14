package com.service;

import com.model.Review;
import com.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    // Retrieve the latest 6 reviews sorted by review date in descending order
    public List<Review> getLatestReviews() {
        return reviewRepository.findTop6ByOrderByReviewDateDesc();
    }

    // Add a new review, setting the review date if not provided
    public Review addReview(Review review) {
        if (review.getReviewDate() == null) {
            review.setReviewDate(LocalDateTime.now());
        }
        return reviewRepository.save(review);
    }
}
