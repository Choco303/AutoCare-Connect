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

    // get review by 6
    public List<Review> getLatestReviews() {
        return reviewRepository.findTop6ByOrderByReviewDateDesc();
    }

    // add review
    public Review addReview(Review review) {
        if (review.getReviewDate() == null) {
            review.setReviewDate(LocalDateTime.now());
        }
        return reviewRepository.save(review);
    }
}
