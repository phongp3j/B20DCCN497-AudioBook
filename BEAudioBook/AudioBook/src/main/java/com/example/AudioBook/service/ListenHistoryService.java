package com.example.AudioBook.service;

import com.example.AudioBook.DTO.ListenHistory.ListenHistoryRequest;
import com.example.AudioBook.DTO.ListenHistory.ListenHistoryResponse;

import java.util.List;

public interface ListenHistoryService {
    String addListenHistory(ListenHistoryRequest listenHistoryRequest);
    List<ListenHistoryResponse> getListenHistory(String username);
}
