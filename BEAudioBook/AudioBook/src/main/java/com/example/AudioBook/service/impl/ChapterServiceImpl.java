package com.example.AudioBook.service.impl;

import com.example.AudioBook.DTO.Chapter.ChapterRequest;
import com.example.AudioBook.entity.Chapter;
import com.example.AudioBook.repository.AudioRepository;
import com.example.AudioBook.repository.BookRepository;
import com.example.AudioBook.repository.ChapterRepository;
import com.example.AudioBook.service.ChapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ChapterServiceImpl implements ChapterService {

    @Autowired
    private ChapterRepository chapterRepository;
    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private AudioRepository audioRepository;
    @Override
    public Long addChapter(ChapterRequest chapterRequest) {
        Chapter chapter = new Chapter();
        chapter.setTitle_chapter(chapterRequest.getChapter_title());
        chapter.setText(chapterRequest.getText());
        chapter.setBook(bookRepository.findById(chapterRequest.getBook_id()).get());
        chapterRepository.save(chapter);
        return chapter.getId();
    }

    @Transactional
    @Override
    public String updateChapter(Long id, ChapterRequest chapterRequest) {
        Chapter chapter = chapterRepository.findById(id).get();
        chapter.setTitle_chapter(chapterRequest.getChapter_title());
        chapter.setText(chapterRequest.getText());
        chapterRepository.save(chapter);
        return "Success!";
    }
    @Transactional
    @Override
    public String deleteChapter(Long id) {
        audioRepository.deleteByChapterId(id);
        chapterRepository.deleteById(id);
        return "Success!";
    }
}
