package com.example.AudioBook.repository;

import com.example.AudioBook.entity.MyAudio;
import com.example.AudioBook.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MyAudioRepository extends JpaRepository<MyAudio,Long> {
    List<MyAudio> findByUser(User user);
}
