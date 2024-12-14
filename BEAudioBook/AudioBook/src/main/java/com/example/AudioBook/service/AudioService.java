package com.example.AudioBook.service;

import com.example.AudioBook.DTO.Audio.AudioRequest;

public interface AudioService {
    Long addAudio(AudioRequest audioRequest);
    String deleteAudio(Long id);
    String updateAudio(Long id,AudioRequest audioRequest);
}
