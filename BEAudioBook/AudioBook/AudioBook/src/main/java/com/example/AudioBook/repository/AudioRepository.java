package com.example.AudioBook.repository;

import com.example.AudioBook.entity.Audio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AudioRepository extends JpaRepository<Audio,Long> {
    Object deleteByChapterId(Long id);

    List<Audio> findByChapterId(Long id);
}
