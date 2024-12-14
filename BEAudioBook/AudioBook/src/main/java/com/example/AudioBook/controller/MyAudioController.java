package com.example.AudioBook.controller;

import com.example.AudioBook.DTO.MyAudio.MyAudioRequest;
import com.example.AudioBook.service.MyAudioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class MyAudioController {
    @Autowired
    private MyAudioService myAudioService;

    @PostMapping("/addMyAudio")
    public ResponseEntity<?> addMyAudio(@RequestBody MyAudioRequest myAudioRequest){
        return ResponseEntity.ok(myAudioService.addMyAudio(myAudioRequest));
    }

    @GetMapping("/getMyAudio/{username}")
    public ResponseEntity<?> getMyAudio(@PathVariable String username){
        return ResponseEntity.ok(myAudioService.getMyAudio(username));
    }
    @DeleteMapping("/deleteMyAudio/{id}")
    public ResponseEntity<?> deleteMyAudio(@PathVariable Long id){
        return ResponseEntity.ok(myAudioService.deleteMyAudio(id));
    }
    @PutMapping("/updateMyAudio/{id}")
    public ResponseEntity<?> updateMyAudio(@PathVariable Long id,@RequestBody MyAudioRequest myAudioRequest){
        return ResponseEntity.ok(myAudioService.updateMyAudio(id,myAudioRequest));
    }
}
