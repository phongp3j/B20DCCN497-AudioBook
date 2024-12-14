package com.example.AudioBook.service;

import com.example.AudioBook.DTO.MyAudio.MyAudioRequest;
import com.example.AudioBook.DTO.MyAudio.MyAudioResponse;

import java.util.List;

public interface MyAudioService {
    String addMyAudio(MyAudioRequest myAudioRequest);
    List<MyAudioResponse> getMyAudio(String username);
    String deleteMyAudio(Long id);
    String updateMyAudio(Long id, MyAudioRequest myAudioRequest);
}
