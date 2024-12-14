package com.example.AudioBook.service;

import com.example.AudioBook.DTO.Review.ReviewRequest;
import com.example.AudioBook.entity.Review;

import java.util.List;

public interface ReviewService {
    List<Review> getReviewsByBookId(Long bookId);
    Review addReview(ReviewRequest reviewRequest);
}
