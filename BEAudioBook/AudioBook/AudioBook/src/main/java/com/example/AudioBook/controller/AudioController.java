package com.example.AudioBook.controller;
import com.example.AudioBook.DTO.Audio.AudioRequest;
import com.example.AudioBook.DTO.Chapter.ChapterRequest;
import com.example.AudioBook.service.AudioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class AudioController {
    @Autowired
    private AudioService audioService;

    @PostMapping("/audio")
    public ResponseEntity<?> addAudio(
            @RequestBody AudioRequest audioRequest){
        return ResponseEntity.ok(audioService.addAudio(audioRequest));
    }

    @DeleteMapping("/audio/{id}")
    public ResponseEntity<?> deleteAudio(
            @PathVariable Long id){
        return ResponseEntity.ok(audioService.deleteAudio(id));
    }

    @PutMapping("/audio/{id}")
    public ResponseEntity<?> putAudio(
            @PathVariable Long id,@RequestBody AudioRequest audioRequest){
        return ResponseEntity.ok(audioService.updateAudio(id,audioRequest));
    }
}
