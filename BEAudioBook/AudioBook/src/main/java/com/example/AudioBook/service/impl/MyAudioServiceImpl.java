package com.example.AudioBook.service.impl;

import com.example.AudioBook.DTO.MyAudio.MyAudioRequest;
import com.example.AudioBook.DTO.MyAudio.MyAudioResponse;
import com.example.AudioBook.entity.MyAudio;
import com.example.AudioBook.repository.MyAudioRepository;
import com.example.AudioBook.repository.UserRepository;
import com.example.AudioBook.service.MyAudioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MyAudioServiceImpl implements MyAudioService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MyAudioRepository myAudioRepository;
    @Override
    public String addMyAudio(MyAudioRequest myAudioRequest) {
        MyAudio myAudio = new MyAudio();
        myAudio.setAudio_name(myAudioRequest.getAudio_name());
        myAudio.setAudio_url(myAudioRequest.getAudio_url());
        myAudio.setUser(userRepository.findByUsername(myAudioRequest.getUsername()).get());
        myAudioRepository.save(myAudio);
        return "Ok";
    }

    @Override
    public List<MyAudioResponse> getMyAudio(String username) {
        List<MyAudio> tmp = myAudioRepository.findByUser(userRepository.findByUsername(username).get());
        List<MyAudioResponse> res = new ArrayList<>();
        for(MyAudio myAudio:tmp){
            MyAudioResponse myAudioResponse = new MyAudioResponse();
            myAudioResponse.setId(myAudio.getId());
            myAudioResponse.setAudio_name(myAudio.getAudio_name());
            myAudioResponse.setAudio_url(myAudio.getAudio_url());
            myAudioResponse.setUsername(myAudio.getUser().getUsername());
            res.add(myAudioResponse);
        }
        return res;
    }

    @Override
    public String deleteMyAudio(Long id) {
        myAudioRepository.deleteById(id);
        return "ok";
    }

    @Override
    public String updateMyAudio(Long id, MyAudioRequest myAudioRequest) {
        MyAudio myAudio = myAudioRepository.findById(id).get();
        myAudio.setAudio_name(myAudioRequest.getAudio_name());
        myAudio.setAudio_url(myAudioRequest.getAudio_url());
        myAudioRepository.save(myAudio);
        return "Ok";
    }
}
