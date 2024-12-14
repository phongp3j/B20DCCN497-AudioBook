package com.example.AudioBook.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chapter")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Chapter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "title_chapter")
    private String title_chapter;
    @Lob
    @Column(name = "text")
    private String text;
    @ManyToOne
    @JoinColumn(name = "bookId")
    private Book book;
    @OneToMany(mappedBy = "chapter",fetch = FetchType.LAZY)
    private List<Audio> audios = new ArrayList<>();
}
