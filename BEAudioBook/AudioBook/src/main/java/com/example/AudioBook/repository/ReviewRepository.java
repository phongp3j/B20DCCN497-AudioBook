package com.example.AudioBook.repository;

import com.example.AudioBook.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review,Long> {
    List<Review> findByBookId(Long bookId);
    Object deleteByBookId(Long id);
}
