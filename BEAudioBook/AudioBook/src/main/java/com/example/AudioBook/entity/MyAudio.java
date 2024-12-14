package com.example.AudioBook.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "my_audio")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class MyAudio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "audio_name")
    private String audio_name;
    @Column(name = "audio_url")
    private String audio_url;
    @ManyToOne
    @JoinColumn(name = "username")
    private User user;
}
