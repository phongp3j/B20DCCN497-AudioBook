package com.example.AudioBook.service.impl;

import com.example.AudioBook.DTO.Audio.AudioRequest;
import com.example.AudioBook.entity.Audio;
import com.example.AudioBook.repository.AudioRepository;
import com.example.AudioBook.repository.ChapterRepository;
import com.example.AudioBook.service.AudioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class AudioServiceImpl implements AudioService {

    @Autowired
    private AudioRepository audioRepository;
    @Autowired
    private ChapterRepository chapterRepository;
    @Override
    public Long addAudio(AudioRequest audioRequest) {
        Audio audio = new Audio();
        audio.setAudio_name(audioRequest.getAudio_name());
        audio.setAudio_file(audioRequest.getAudio_file());
        audio.setChapter(chapterRepository.findById(audioRequest.getChapter_id()).get());
        audioRepository.save(audio);
        return audio.getId();
    }

    @Override
    public String deleteAudio(Long id) {
        audioRepository.deleteById(id);
        return "Success!";
    }

    @Override
    public String updateAudio(Long id, AudioRequest audioRequest) {
        Audio audio = audioRepository.findById(id).get();
        audio.setAudio_file(audioRequest.getAudio_file());
        audio.setAudio_name(audioRequest.getAudio_name());
        audioRepository.save(audio);
        return "Success!";
    }
}
