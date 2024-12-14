package com.example.AudioBook.service;

import com.example.AudioBook.DTO.Chapter.ChapterRequest;

public interface ChapterService {
    Long addChapter(ChapterRequest chapterRequest);

    String updateChapter(Long id, ChapterRequest chapterRequest);
    String deleteChapter(Long id);
}
