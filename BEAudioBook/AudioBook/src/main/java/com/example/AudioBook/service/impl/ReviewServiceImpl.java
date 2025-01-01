package com.example.AudioBook.service.impl;

import com.example.AudioBook.DTO.Review.ReviewRequest;
import com.example.AudioBook.DTO.Review.ReviewStat;
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

    @Override
    public String deleteReview(Long id) {
        reviewRepository.deleteById(id);
        return "ok";
    }

    @Override
    public ReviewStat getStatReviews() {
        ReviewStat reviewStat =  new ReviewStat();
        List<Review> reviews = reviewRepository.findAll();
        float s5 = 0;
        float s4 = 0;
        float s3 = 0;
        float s2 = 0;
        float s1 = 0;
        for (Review review : reviews) {
            if (review.getRating() == 5) {
                s5++;
            } else if (review.getRating() == 4) {
                s4++;
            } else if (review.getRating() == 3) {
                s3++;
            } else if (review.getRating() == 2) {
                s2++;
            } else if (review.getRating() == 1) {
                s1++;
            }
        }
        reviewStat.setS5(s5/reviews.size());
        reviewStat.setS4(s4/reviews.size());
        reviewStat.setS3(s3/reviews.size());
        reviewStat.setS2(s2/reviews.size());
        reviewStat.setS1(s1/reviews.size());
        return reviewStat;
    }

    @Override
    public ReviewStat getStatReviewOfBook(Long bookId) {
        ReviewStat reviewStat =  new ReviewStat();
        List<Review> reviews = reviewRepository.findByBookId(bookId);
        float s5 = 0;
        float s4 = 0;
        float s3 = 0;
        float s2 = 0;
        float s1 = 0;
        for (Review review : reviews) {
            if (review.getRating() == 5) {
                s5++;
            } else if (review.getRating() == 4) {
                s4++;
            } else if (review.getRating() == 3) {
                s3++;
            } else if (review.getRating() == 2) {
                s2++;
            } else if (review.getRating() == 1) {
                s1++;
            }
        }
        reviewStat.setS5(s5/reviews.size());
        reviewStat.setS4(s4/reviews.size());
        reviewStat.setS3(s3/reviews.size());
        reviewStat.setS2(s2/reviews.size());
        reviewStat.setS1(s1/reviews.size());
        return reviewStat;
    }
}
