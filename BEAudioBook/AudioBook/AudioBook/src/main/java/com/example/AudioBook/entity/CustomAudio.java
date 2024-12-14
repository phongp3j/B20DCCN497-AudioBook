package com.example.AudioBook.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "custom_audio")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class CustomAudio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "audio_name")
    private String audio_name;
    @Column(name = "audio_file")
    private String audio_file;
    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;
}
