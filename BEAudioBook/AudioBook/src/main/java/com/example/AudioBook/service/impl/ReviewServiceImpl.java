package com.example.AudioBook.service.impl;

import com.example.AudioBook.DTO.Review.ReviewRequest;
import com.example.AudioBook.entity.Book;
import com.example.AudioBook.entity.Review;
import com.example.AudioBook.entity.User;
import com.example.AudioBook.repository.BookRepository;
import com.example.AudioBook.repository.ReviewRepository;
import com.example.AudioBook.repository.UserRepository;
import com.example.AudioBook.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewServiceImpl implements ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BookRepository bookRepository;
    @Override
    public List<Review> getReviewsByBookId(Long bookId) {
        return reviewRepository.findByBookId(bookId);
    }
    @Override
    public Review addReview(ReviewRequest reviewRequest) {
        User user = userRepository.findByUsername(reviewRequest.getUsername()).get();
        Book book = bookRepository.findById(reviewRequest.getBook_id()).get();
        Review review = new Review();
        review.setReview(reviewRequest.getReview());
        review.setRating(reviewRequest.getRating());
        review.setUser(user);
        review.setBook(book);
        return reviewRepository.save(review);
    }
}
