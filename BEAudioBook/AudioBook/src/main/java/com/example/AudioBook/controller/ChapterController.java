package com.example.AudioBook.controller;


import com.example.AudioBook.DTO.Chapter.ChapterRequest;
import com.example.AudioBook.service.ChapterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ChapterController {

    @Autowired
    private ChapterService chapterService;
    @PostMapping("/chapter")
    public ResponseEntity<?> addChapter(
            @RequestBody ChapterRequest chapterRequest){
        return ResponseEntity.ok(chapterService.addChapter(chapterRequest));
    }

    @PutMapping("/chapter/{id}")
    public ResponseEntity<?> updateChapter(@PathVariable Long id,
            @RequestBody ChapterRequest chapterRequest){
        return ResponseEntity.ok(chapterService.updateChapter(id,chapterRequest));
    }

    @DeleteMapping("/chapter/{id}")
    public ResponseEntity<?> deleteChapter(@PathVariable Long id){
        return ResponseEntity.ok(chapterService.deleteChapter(id));
    }
}
