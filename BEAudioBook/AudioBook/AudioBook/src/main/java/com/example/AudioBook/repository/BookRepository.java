package com.example.AudioBook.repository;

import com.example.AudioBook.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book,Long> {
    List<Book> findByCategoryId(Long id);
}
