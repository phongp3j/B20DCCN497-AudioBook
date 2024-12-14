package com.example.AudioBook.controller;

import com.example.AudioBook.DTO.ListenHistory.ListenHistoryRequest;
import com.example.AudioBook.service.ListenHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class ListenHistoryController {
    @Autowired
    private ListenHistoryService listenHistoryService;

    @PostMapping("/listenHistory")
    public ResponseEntity<?> addListenHistory(@RequestBody ListenHistoryRequest listenHistoryRequest){
        return ResponseEntity.ok(listenHistoryService.addListenHistory(listenHistoryRequest));
    }
    @GetMapping("/listenHistory/{username}")
    public ResponseEntity<?> getListenHistory(@PathVariable String username){
        return ResponseEntity.ok(listenHistoryService.getListenHistory(username));
    }
}
