package com.example.AudioBook.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "listen_history")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ListenHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "titleOfBook")
    private String titleOfBook;
    @Column(name = "titleOfChapter")
    private String titleOfChapter;
    @Column(name = "audio_url")
    private String audio_url;
    @ManyToOne
    @JoinColumn(name = "username")
    private User user;
    @Column(name = "nameOfAudio")
    private String nameOfAudio;
    @Column(name = "time")
    private String time;
}
