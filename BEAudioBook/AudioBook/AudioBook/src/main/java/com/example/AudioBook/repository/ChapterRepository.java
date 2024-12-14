package com.example.AudioBook.repository;

import com.example.AudioBook.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChapterRepository extends JpaRepository<Chapter,Long> {
    List<Chapter> findByBookId(Long id);
}
